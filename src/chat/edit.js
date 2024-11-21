import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function Edit({ attributes, setAttributes }) {
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
            console.log('Constructed URL:', url.toString()); // Debug log
            return url.toString();
        } catch (e) {
            console.error('Error constructing URL:', e);
            return defaultChatUrl;
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
                    <div className="wp-block-eddolearning-chat-wrapper" style={{ position: 'relative', width: '100%', height: '600px' }}>
                        <iframe 
                            src={iframeUrl}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            title="Chat Interface"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        ></iframe>
                        {/* Debug display */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', fontSize: '12px' }}>
                            URL: {iframeUrl}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
} 