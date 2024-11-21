import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { chatSrc, unitId } = attributes;
    const blockProps = useBlockProps.save();

    const getFullUrl = (baseUrl) => {
        try {
            const url = new URL(baseUrl);
            url.searchParams.set('unit_id', encodeURIComponent(unitId));
            url.searchParams.set('embed', 'true');
            return url.toString();
        } catch (e) {
            return baseUrl;
        }
    };

    return (
        <div {...blockProps}>
            {chatSrc && (
                <div className="wp-block-eddolearning-chat-wrapper" style={{ position: 'relative', width: '100%', height: '600px' }}>
                    <iframe 
                        src={getFullUrl(chatSrc)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                        title="Chat Interface"
                    ></iframe>
                </div>
            )}
        </div>
    );
} 