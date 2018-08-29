import React from 'react';
import { Items, itemCategory, itemStatus, Categories } from './ItemMocks';

export default ({ id }) => {
    const item = Items.find(item => item.id === id);

    if (!item) {
        return (
            <header>
                <h3>Item does not exist</h3>
            </header>
        );
    }
    return <div>
        <header>
            <h3>{item.name}</h3>
        </header>
        <table>
            <tbody>
                <tr>
                    <th align='right'>Category: </th>
                    <td>{itemCategory(item)}</td>
                </tr>
                <tr>
                    <th align='right'>Status: </th>
                    <td>{itemStatus(item)}</td>
                </tr>
            </tbody>
        </table>
    </div>;
};
