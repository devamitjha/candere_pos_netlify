import React from 'react';
import './filter.scss';
import FilterCard from './FilterCard';
import FilterDetails from './FilterDetails';
import { useSelector } from 'react-redux';

const Filter = ({productID, searchProductID}) => {
  const productsList = useSelector((state) => state.products.items); 
  const searchProductsList = useSelector((state) => state.search.items); 
  const filteredProducts = searchProductID 
    ? searchProductsList.filter(product => product.priorityshipping_id === searchProductID) 
    : productsList.filter(product => product.priorityshipping_id === productID);
  return (
    <div className='filter'>
        <FilterCard itemDetails={filteredProducts[0]} />
        <FilterDetails itemDetails={filteredProducts[0]}/>
    </div>
  )
}

export default Filter
