import Card from './Card.jsx';

export default function Stat({ icon: Icon, label, value, foot }) {
    return (
        <Card className="stat">
            <div className="stat-top">
                <span>{label}</span>
                <span className="icon-circle"><Icon size={19} /></span>
            </div>
            <strong>{value}</strong>
            <small>{foot}</small>
        </Card>
    );
}
