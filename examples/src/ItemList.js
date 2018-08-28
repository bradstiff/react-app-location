import React from 'react';
import { Link } from 'react-router-dom';
import { ItemListLocation, ItemLocation } from './Locations';
import { Items, Categories } from './Mocks';

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
                <h2>Item List</h2>
                <div>
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
                <ul>
                    {Items
                        .filter(item => (isActive === undefined || item.isActive === isActive) && (categoryID === undefined || item.categoryID === categoryID))
                        .map(item => (
                            <li key={item.id}>
                                <Link to={ItemLocation.toUrl({ id: item.id })}>{item.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
};

export default ItemList;