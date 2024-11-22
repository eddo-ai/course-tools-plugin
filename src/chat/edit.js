import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function Edit({ attributes, setAttributes, isSelected }) {
    const blockProps = useBlockProps();
    const { chatSrc, unitId } = attributes;
    
    const defaultChatUrl = 'https://chat.livelyplant-e406dec0.eastus.azurecontainerapps.io';
    
    // Get the current post title
    const postTitle = useSelect(select => {
        const currentPost = select('core/editor').getCurrentPost();
        return currentPost?.title || '';
    }, []);

    // Construct the full URL with query parameters
    const getFullUrl = (baseUrl) => {
        try {
            const url = new URL(baseUrl || defaultChatUrl);
            if (postTitle) {
                url.searchParams.set('lesson_name', encodeURIComponent(postTitle));
            }
            if (unitId) {
                url.searchParams.set('unit_id', encodeURIComponent(unitId));
            }
            url.searchParams.set('embed', 'true');
            return url.toString();
        } catch (e) {
            console.error('Error constructing URL:', e);
            return `${defaultChatUrl}?embed=true`;
        }
    };

    // Set default value if chatSrc is empty
    if (!chatSrc) {
        setAttributes({ chatSrc: defaultChatUrl });
    }

    const iframeUrl = getFullUrl(chatSrc);

    return (
        <>
            <InspectorControls>
                <PanelBody
                    title="Chat Settings"
                    initialOpen={true}
                >
                    <TextControl
                        label="Chat URL"
                        value={chatSrc}
                        onChange={(value) => setAttributes({ chatSrc: value })}
                        help="The base URL for the chat interface"
                    />
                    <TextControl
                        label="Unit ID"
                        value={unitId}
                        onChange={(value) => setAttributes({ unitId: value })}
                        help="The unit ID for this lesson (e.g. 7.1)"
                    />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                {chatSrc && (
                    <div className="wp-block-eddolearning-chat-wrapper" style={{ position: 'relative' }}>
                        <iframe 
                            src={iframeUrl}
                            height="600"
                            style={{
                                width: '100%',
                                border: 'none'
                            }}
                            title="Chat Interface"
                        ></iframe>
                        {!isSelected && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    cursor: 'pointer',
                                    background: 'rgba(0, 0, 0, 0.02)',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                                }}
                                aria-label="Select chat block"
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
} 