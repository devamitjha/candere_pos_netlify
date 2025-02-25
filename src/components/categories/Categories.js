import React from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../sectionTitle/SectionTitle';
import { productCategories } from '../../services/ProductCategories';
import './categories.scss';

const Categories = () => {     
console.log(productCategories);
  return (
    <div className='categoriesWrapper'>
        <SectionTitle title="Product Categories" />
        <div className="categories--listing">
            {productCategories.map((item, index) => {
                return (
                    <Link to={item.identifier} key={index} className="categories--item" >
                        <img src={item.image} alt={item.title} className="img-fluid categories--item-image" />
                        <div className="categories--item-content">
                            <span className="categories--item-content-count">{item.count}</span>
                            <span className="categories--item-content-name">{item.title}</span>
                        </div>
                    </Link>
                )
            })}
        </div>
    </div>
  )
}

export default Categories
