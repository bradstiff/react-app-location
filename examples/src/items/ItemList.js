import React from 'react';
import { Link } from 'react-router-dom';
import { ItemListLocation, ItemLocation } from '../app/Locations';
import { Items, itemCategory, itemStatus, Categories } from './ItemMocks';

const styles = {
    toolbar: {
        display: 'flex',
        alignItems: 'center',
    },
    filter: {
        paddingLeft: 20,
    }
}

class ItemList extends React.Component {
    replaceLocation(token) {
        const { isActive, categoryID } = this.props;
        const tokens = {
            isActive,
            categoryID
        };
        const nextLocation = ItemListLocation.toUrl({
            ...tokens,
            ...token
        });
        this.props.history.replace(nextLocation);
    }

    handleSelectStatus = event => {
        const isActive = event.target.value;
        this.replaceLocation({ isActive });
    }

    handleSelectCategory = event => {
        const categoryID = event.target.value;
        this.replaceLocation({ categoryID });
    }

    render() {
        const { isActive, categoryID } = this.props;
        return (
            <div>
                <div style={styles.toolbar}>
                    <h3>Items</h3>
                    <div style={styles.filter}>
                        <select id='isActive' value={isActive} onChange={this.handleSelectStatus}>
                            <option value='undefined'>All statuses</option>
                            <option value='true'>Active</option>
                            <option value='false'>Inactive</option>
                        </select>
                        <select id='categoryID' value={categoryID} onChange={this.handleSelectCategory}>
                            {[
                                <option key='All categories' value='undefined'>All categories</option>,
                                ...Categories.map(category => <option key={category.name} value={category.id}>{category.name}</option>)
                            ]}
                        </select>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Items
                            .filter(item => (isActive === undefined || item.isActive === isActive) && (categoryID === undefined || item.categoryID === categoryID))
                            .map(item => (
                                <tr key={item.id}>
                                    <td><Link to={ItemLocation.toUrl({ id: item.id })}>{item.name}</Link></td>
                                    <td>{itemCategory(item)}</td>
                                    <td>{itemStatus(item)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
};

export default ItemList;