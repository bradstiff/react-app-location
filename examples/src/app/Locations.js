import * as Yup from 'yup';
import Location from '../../../src/Location';

const integer = Yup.number().integer();
const wholeNbr = integer.positive();

export const HomeLocation = new Location('/');

export const ItemListLocation = new Location('/items', null, {
    isActive: Yup.boolean(),
    categoryID: wholeNbr.nullable(),
});

export const ItemLocation = new Location('/items/:id', { id: wholeNbr.required() });

export default {
    Home: HomeLocation,
    ItemList: ItemListLocation,
    Item: ItemLocation,
};