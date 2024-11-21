import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { slidesSrc, startSlide } = attributes;
    const blockProps = useBlockProps.save();

    if (!slidesSrc) {
        return null;
    }

    let embedUrl = slidesSrc;
    if (embedUrl.includes('docs.google.com/presentation')) {
        const matches = embedUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (matches && matches[1]) {
            embedUrl = `https://docs.google.com/presentation/d/${matches[1]}/embed?start=false&loop=false&delayms=3000`;
            if (startSlide !== '1') {
                embedUrl += `&slide=${startSlide}`;
            }
        }
    }

    return (
        <div {...blockProps}>
            <iframe
                src={embedUrl}
                width="100%"
                height="600"
                frameBorder="0"
                allowFullScreen={true}
                title="Presentation Slides"
            />
        </div>
    );
} 