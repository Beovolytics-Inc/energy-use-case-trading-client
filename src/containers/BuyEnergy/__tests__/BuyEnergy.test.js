import React from 'react';
import { shallowWithIntl } from '../../../services/intlTestHelper';
import { BuyEnergy } from '../BuyEnergy';
import * as producersActionPerformers from '../../../action_performers/producers';
import * as notificationsActionPerformers from '../../../action_performers/notifications';

const producersMock = [
    { id: 0, price: 2.9, plantType: 'solar', name: 'John Doe' },
    { id: 1, price: 2, plantType: 'wind', name: 'Peter Producer' },
    { id: 2, price: 1, plantType: 'biomass', name: 'Jeremy' },
    { id: 3, price: 5, plantType: 'wind', name: 'Blark' },
    { id: 4, price: 1, plantType: 'solar', name: 'Alice' }
];
const currentProducerMock = producersMock[1];
const historyMock = {
    push: jest.fn()
};
const routerMock = {
    history: historyMock
};

function renderComponent(
    {
        currentProducerLoading = false,
        currentProducer = currentProducerMock,
        producersLoading = false,
        producers = producersMock,
        hasNextProducers = false,
        ...otherProps
    } = {},
    mountFn = shallowWithIntl
) {
    return mountFn(
        <BuyEnergy
            currentProducerLoading={currentProducerLoading}
            currentProducer={currentProducer}
            producersLoading={producersLoading}
            producers={producers}
            hasNextProducers={hasNextProducers}
            {...otherProps}
        />,
        {
            context: { router: routerMock }
        }
    );
}

describe('<BuyEnergy /> container', () => {
    jest.useFakeTimers();

    const mainContainerMock = document.createElement('div');

    beforeAll(() => {
        jest.spyOn(producersActionPerformers, 'performGetCurrentProducer').mockImplementation(jest.fn());
        jest.spyOn(producersActionPerformers, 'performGetProducers').mockImplementation(jest.fn());
        jest.spyOn(notificationsActionPerformers, 'performPushNotification').mockImplementation(jest.fn());
        jest.spyOn(document, 'getElementById').mockReturnValue(mainContainerMock);
        jest.spyOn(mainContainerMock, 'addEventListener');
        jest.spyOn(mainContainerMock, 'removeEventListener');
    });

    afterEach(() => {
        producersActionPerformers.performGetProducers.mockClear();
        historyMock.push.mockClear();
    });

    it('should renders without errors', () => {
        const buyEnergy = renderComponent({
            currentProducerLoading: true,
            producersLoading: true
        });
        const handleScrollMock = buyEnergy.instance().scrollHandler;

        expect(mainContainerMock.addEventListener).toHaveBeenCalledWith('scroll', buyEnergy.instance().scrollHandler);

        buyEnergy.unmount();
        expect(mainContainerMock.removeEventListener).toHaveBeenCalledWith('scroll', handleScrollMock);
    });

    it('should return correct props', () => {
        const stateMock = {
            Producers: {
                currentProducer: {
                    data: producersMock[1],
                    error: null,
                    loading: false
                },
                producers: {
                    data: {
                        total: 10,
                        entries: producersMock
                    },
                    error: null,
                    loading: false
                }
            },
            Users: {}
        };
        const props = BuyEnergy.mapStateToProps(stateMock);

        expect(props).toEqual({
            error: null,
            currentProducerLoading: false,
            currentProducer: producersMock[1],
            producersLoading: false,
            producers: producersMock,
            hasNextProducers: true
        });
    });

    it('should call performGetProducers on did mount hook', () => {
        renderComponent({ producers: [] });

        expect(producersActionPerformers.performGetProducers).toHaveBeenCalled();
    });

    it('should calls performGetProducers when page increase', () => {
        const buyEnergy = renderComponent({
            currentProducerLoading: true,
            producersLoading: true
        });

        buyEnergy.setState({ page: 1 });
        expect(producersActionPerformers.performGetProducers).toHaveBeenCalledWith({ page: 1, filter: [] });
    });

    it('should calls performGetProducers with selected filter and first page', () => {
        const buyEnergy = renderComponent({
            currentProducerLoading: true,
            producersLoading: true
        });

        buyEnergy.setState({
            page: 2
        });

        buyEnergy
            .find('ProducersFilter')
            .props()
            .onChange(['wind']);
        buyEnergy.instance().componentDidUpdate({}, {});
        expect(producersActionPerformers.performGetProducers).toHaveBeenCalledWith({ page: 0, filter: ['wind'] });
    });

    it('should call performPushNotification if error has occurred', () => {
        const buyEnergy = renderComponent();

        buyEnergy.setProps({ error: { message: 'TEST' } });
        expect(notificationsActionPerformers.performPushNotification).toHaveBeenCalledWith({
            message: 'TEST',
            type: 'error'
        });
    });

    it('should not update state if scroll up', () => {
        const buyEnergy = renderComponent({ hasNextProducers: true });
        const scrollEventMock = new Event('scroll', {
            target: mainContainerMock
        });

        buyEnergy.instance().lastScrollTop = 1;

        mainContainerMock.dispatchEvent(scrollEventMock);
        jest.runAllTimers();

        expect(buyEnergy.state().page).toBe(0);
    });

    it('should update state after scroll', () => {
        const buyEnergy = renderComponent({ hasNextProducers: true });
        const scrollEventMock = new Event('scroll', {
            target: mainContainerMock
        });

        mainContainerMock.scrollTop = 2;
        buyEnergy.instance().lastScrollTop = 1;

        mainContainerMock.dispatchEvent(scrollEventMock);
        jest.runAllTimers();

        expect(buyEnergy.state().page).toBe(1);
    });

    it('should opens trading page', () => {
        const buyEnergy = renderComponent();

        buyEnergy.find('.back-link').simulate('click', { preventDefault: jest.fn() });
        expect(historyMock.push).toHaveBeenCalledWith('/trading');
    });

    it('should opens producer page', () => {
        const buyEnergy = renderComponent();

        buyEnergy
            .find('ProducerCardsPanel')
            .props()
            .onProducerClick(1);
        expect(historyMock.push).toHaveBeenCalledWith('/buy_energy/producer/1');
    });
});
