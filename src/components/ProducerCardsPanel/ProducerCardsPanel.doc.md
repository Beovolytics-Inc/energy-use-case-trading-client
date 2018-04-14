#### ProducerCardsPanel component

```jsx
const wrapperStyle = {
    padding: '1rem 2rem',
    background: '#f0f4f7'
};
const producers = [
    { id: 0, price: 2.9, plantType: 'solar', name: 'John Doe' },
    { id: 1, price: 2, plantType: 'wind', name: 'Peter Producer' },
    { id: 2, price: 1, plantType: 'biomass', name: 'Jeremy' },
    { id: 3, price: 5, plantType: 'wind', name: 'Blark' },
    { id: 4, price: 1, plantType: 'solar', name: 'Alice' }
];

<div style={wrapperStyle}>
    <ProducerCardsPanel producers={producers} selectedProducerId={1} />
</div>;
```

#### ProducerCardsPanel with loader

```jsx
const wrapperStyle = {
    padding: '1rem 2rem',
    background: '#f0f4f7'
};
const producers = [
    { id: 0, price: 2.9, plantType: 'solar', name: 'John Doe' },
    { id: 1, price: 2, plantType: 'wind', name: 'Peter Producer' },
    { id: 2, price: 1, plantType: 'biomass', name: 'Jeremy' },
    { id: 3, price: 5, plantType: 'wind', name: 'Blark' },
    { id: 4, price: 1, plantType: 'solar', name: 'Alice' }
];

<div style={wrapperStyle}>
    <ProducerCardsPanel loading producers={producers} selectedProducerId={1} />
</div>;
```