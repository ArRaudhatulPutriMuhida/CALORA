export default function Heading({ eyebrow, title, description }) {
    return (
        <div className="heading">
            <div>
                <span className="eyebrow">{eyebrow}</span>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </div>
    );
}
