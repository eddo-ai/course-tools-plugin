import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';

export default function Edit( { attributes, setAttributes, isSelected } ) {
	const blockProps = useBlockProps();
	const { chatSrc, unitId } = attributes;

	// Get the saved default URL from preferences
	const savedDefaultUrl = useSelect(
		( select ) =>
			select( preferencesStore ).get(
				'eddolearning-course-tools',
				'defaultChatUrl'
			),
		[]
	);

	const { set: setPreference } = useDispatch( preferencesStore );

	// Use saved default if available, otherwise use hardcoded default
	const defaultChatUrl =
		savedDefaultUrl ||
		'https://chat.livelyplant-e406dec0.eastus.azurecontainerapps.io';

	// Get the current post title
	const postTitle = useSelect( ( select ) => {
		const { getEditedPostAttribute } = select( 'core/editor' );
		return getEditedPostAttribute( 'title' ) || '';
	}, [] );

	// Log the title to verify it's working
	console.log( 'Current post title:', postTitle );

	// Construct the full URL with query parameters
	const getFullUrl = ( baseUrl ) => {
		try {
			const url = new URL( baseUrl || defaultChatUrl );
			if ( postTitle ) {
				url.searchParams.set(
					'lesson_name',
					encodeURIComponent( postTitle )
				);
			}
			if ( unitId ) {
				url.searchParams.set( 'unit_id', encodeURIComponent( unitId ) );
			}
			url.searchParams.set( 'embed', 'true' );
			return url.toString();
		} catch ( e ) {
			console.error( 'Error constructing URL:', e );
			return `${ defaultChatUrl }?embed=true`;
		}
	};

	// Set default value if chatSrc is empty
	if ( ! chatSrc ) {
		setAttributes( { chatSrc: defaultChatUrl } );
	}

	const handleUrlChange = ( value ) => {
		setAttributes( { chatSrc: value } );
		// Save the new URL as the default if it's valid
		try {
			new URL( value );
			setPreference(
				'eddolearning-course-tools',
				'defaultChatUrl',
				value
			);
		} catch ( e ) {
			// Don't save invalid URLs as default
			console.warn( 'Invalid URL not saved as default:', value );
		}
	};

	const iframeUrl = getFullUrl( chatSrc );
	console.log( 'Final iframe URL:', iframeUrl );

	return (
		<>
			<InspectorControls>
				<PanelBody title="Chat Settings" initialOpen={ true }>
					<TextControl
						label="Chat URL"
						value={ chatSrc }
						onChange={ handleUrlChange }
						help="The base URL for the chat interface"
					/>
					<TextControl
						label="Unit ID"
						value={ unitId }
						onChange={ ( value ) =>
							setAttributes( { unitId: value } )
						}
						help="The unit ID for this lesson (e.g. 7.1)"
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ chatSrc && (
					<div
						className="wp-block-eddolearning-chat-wrapper"
						style={ { position: 'relative' } }
					>
						<iframe
							src={ iframeUrl }
							height="600"
							style={ {
								width: '100%',
								border: 'none',
							} }
							title="Chat Interface"
						></iframe>
						{ ! isSelected && (
							<div
								style={ {
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									cursor: 'pointer',
									background: 'rgba(0, 0, 0, 0.02)',
									transition: 'background 0.2s ease',
								} }
								onMouseOver={ ( e ) => {
									e.currentTarget.style.background =
										'rgba(0, 0, 0, 0.05)';
								} }
								onMouseOut={ ( e ) => {
									e.currentTarget.style.background =
										'rgba(0, 0, 0, 0.02)';
								} }
								aria-label="Select chat block"
							/>
						) }
					</div>
				) }
			</div>
		</>
	);
}
