import { Button, Card } from 'react-bootstrap';
function Tiers() {
    const suscriptionTiers = [
        {
            id: 1,
            name: "Bronze",
            price: 2500,
            quota: 2,
            color: "#824621",
            imageUrl: "https://imgs.search.brave.com/xqYNsWqv3a2QWtWr6GY3JrKAeEvKY_M3x4E_ABF8G18/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzMv/MDc2LzcxNi9zbWFs/bC8zZC1icm9uemUt/bWVkYWwtc3Rhci1h/d2FyZC1pY29uLXBu/Zy5wbmc",
        },
        {
            id: 2,
            name: "Silver",
            price: 3500,
            quota: 4,
            color: "#A3A3A3",
            imageUrl: "https://imgs.search.brave.com/i1vVVNIX5gGwJBA7jR4h-SK2cZ4kI-a4i4RRCCLL5rU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/dmVjdG9yLXByZW1p/dW0vbWFxdWV0YS1y/ZWFsaXN0YS1tZWRh/bGxhLXBsYXRhLW1l/ZGFsbGEtcGxhdGEt/Y2ludGEtZGlzZW5v/LWdhbmFkb3ItbWVk/YWxsYS1wcmF0YS1w/cmVtaW8tbWVkYWxs/YXMtcHJlbWlvLWdh/bmFkb3ItaWx1c3Ry/YWNpb24tdmVjdG9y/aWFsXzU2MTE1OC00/MjA3LmpwZz9zZW10/PWFpc19oeWJyaWQm/dz03NDAmcT04MA",
        },
        {
            id: 3,
            name: "Gold",
            price: 5000,
            quota: 6,
            color: "#FF9914",
            imageUrl: "https://imgs.search.brave.com/Zlx1ePvA7NYI0K9-FixDs4gai4g0wBRmWUxOYaG1xcM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudmV4ZWxzLmNv/bS9tZWRpYS91c2Vy/cy8zLzE5NDM4MS9p/c29sYXRlZC9wcmV2/aWV3L2RhZDcxYzlj/N2Y3MGQyMzVjODZl/NDMwNjg0Y2RhMDZl/LWljb25vLWRlLW1l/ZGFsbGEtZGUtZXN0/cmVsbGEtZGUtb3Jv/LXBlbnRhZ29uby5w/bmc"
        }
    ];

    const handleSuscript = () => {
        console.log('Te has suscripto al plan')
    }

    return (
        <div className="d-flex justify-content-center align-items-center gap-3"
            style={{ minHeight: "100vh" }}
        >
            {suscriptionTiers.map((tier) => (
                <Card className='text-center'
                    style={{ width: '18rem',
                    backgroundColor: tier.color,
                    border: '2px solid black'}}
                    key={tier.id}
                >
                    <Card.Img variant="top" src={tier.imageUrl} />
                    <Card.Body>
                        <Card.Title>{tier.name}</Card.Title>
                        <Card.Text>
                            {tier.price}
                        </Card.Text>
                        <Card.Text>
                            {tier.quota}
                        </Card.Text>
                        <Button variant="primary" onClick={handleSuscript}>Suscribirse</Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}

export default Tiers;