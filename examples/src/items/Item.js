import React from 'react';
import { Items, itemCategory, itemStatus, Categories } from './ItemMocks';

export default ({ id }) => {
    const item = Items.find(item => item.id === id);

    return <div>
        <h3>{item.name}</h3>
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
