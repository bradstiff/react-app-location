import * as Yup from 'yup';
import Location from '../../src/Location';

const integer = Yup.number().integer();
const naturalNbr = integer.moreThan(-1);
const wholeNbr = integer.positive();

const Locations = {
    Home: new Location('/'),
    Items: new Location('/items', null, {
        page: naturalNbr.default(0),
        isActive: Yup.boolean(),
        categoryID: wholeNbr.nullable(),
    }),
    Item: new Location('/item/:id', { id: wholeNbr.required() }),
};

export default Locations;