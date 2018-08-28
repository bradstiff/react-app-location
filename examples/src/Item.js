import React from 'react';
import { Items, Categories } from './Mocks';

export default ({ id }) => {
    const item = Items.find(item => item.id === id);
    const category = Categories.find(category => category.id === item.categoryID);

    return <div>
        <h2>{item.name}</h2>
        <table>
            <tbody>
                <tr>
                    <th align='right'>Category: </th>
                    <td>{category.name}</td>
                </tr>
                <tr>
                    <th align='right'>Status: </th>
                    <td>{item.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
            </tbody>
        </table>
    </div>;
};
