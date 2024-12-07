import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, PanelBody } from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
	const { slidesSrc, startSlide } = attributes;
	const blockProps = useBlockProps();

	const validateStartSlide = ( value ) => {
		// Allow numbers (1, 2, ...) or letters (A, B, AA, ...)
		return /^[1-9]\d*$/.test( value ) || /^[A-Z]{1,2}$/i.test( value );
	};

	const getEmbedUrl = () => {
		if ( ! slidesSrc ) return '';

		let embedUrl = slidesSrc;

		// Handle Google Slides URLs
		if ( embedUrl.includes( 'docs.google.com/presentation' ) ) {
			// Extract presentation ID
			const matches = embedUrl.match( /\/d\/([a-zA-Z0-9-_]+)/ );
			if ( matches && matches[ 1 ] ) {
				embedUrl = `https://docs.google.com/presentation/d/${ matches[ 1 ] }/embed`;
			}

			// Add Google Slides specific parameters
			const separator = embedUrl.includes( '?' ) ? '&' : '?';
			embedUrl = `${ embedUrl }${ separator }start=false&loop=false&delayms=3000`;

			if ( startSlide !== '1' ) {
				embedUrl += `&slide=${ startSlide }`;
			}
		} else {
			// Handle other slide providers
			const separator = embedUrl.includes( '?' ) ? '&' : '?';
			embedUrl = `${ embedUrl }${ separator }start=${ encodeURIComponent(
				startSlide
			) }`;
		}

		return embedUrl;
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title="Slides Settings">
					<TextControl
						label="Slides Source URL"
						value={ slidesSrc }
						onChange={ ( value ) =>
							setAttributes( { slidesSrc: value } )
						}
						help="For Google Slides, paste the presentation URL"
					/>
					<TextControl
						label="Starting Slide"
						value={ startSlide }
						onChange={ ( value ) => {
							if ( validateStartSlide( value ) ) {
								setAttributes( {
									startSlide: value.toUpperCase(),
								} );
							}
						} }
						help="Enter a number (1, 2, ...) or letter (A, B, AA, ...)"
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ slidesSrc ? (
					<iframe
						src={ getEmbedUrl() }
						width="100%"
						height="600"
						frameBorder="0"
						allowFullScreen="true"
						mozallowfullscreen="true"
						webkitallowfullscreen="true"
						title="Presentation Slides"
					/>
				) : (
					<p className="bg-blue-500">Please enter a slides URL in the block settings.</p>
				) }
			</div>
		</>
	);
}
