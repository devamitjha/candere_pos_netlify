import React from 'react';
import { Link } from 'react-router-dom';


const CategoriesChild = ({matchedCategory}) => {    
  return (
    <>
    <div className="menuWrapper">
        {matchedCategory.categoryChildren.map((item, index)=>(
            <div className="mainMenu--body innerMenu--body" key={index}>
                <div className="recommendBox">
                    <p className="mainMenu--title">{item.recommended.recommend}</p>
                    <Link to={item.recommended.url} title={item.recommended.recommend} className="recommendBox--wrapper">
                        <img src={item.recommended.recommend_img} alt={item.recommended.recommend}
                            className="img-fluid w-100 recommendBox--image" />
                    </Link>
                </div>
                <div className="mainMenu--body-box">
                    <div className="shopBy--wrapper">
                        <div className="shopBy--list shopByStyle">
                            <p className="mainMenu--title">{item.shopByStyle[0].shopByStyleTitle}</p>
                            {item.shopByStyle.slice(1).map((child, index) => (
                                <Link key={index} to={child.catUrl} title={child.catTitle} className="shopBy--list--items">
                                    <img src={child.catImage} alt={child.catTitle}
                                        className="shopBy--list--items-pic" />
                                    <div className="shopBy--list--items-content">
                                        <p className="shopBy--list--items-content-title">{child.catTitle}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mainMenu--body-box">
                    <div className="shopBy--wrapper">
                        <div className="shopBy--grid shopByMaterial">
                            <p className="mainMenu--title">{item.shopByMaterial[0].shopByMaterialTitle}</p>
                            {item.shopByMaterial.slice(1).map((child, index) => (
                                <Link key={index} to={child.catUrl} title={child.catTitle} className="shopBy--grid--items">
                                    <img src={child.catImage} alt={child.catTitle} className="shopBy--grid--items-image" />
                                    {child.catTitle}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mainMenu--body-box">
                    <div className="shopBy--wrapper">
                        <div className="shopBy--price shopByPrice">
                            <p className="mainMenu--title">{item.shopByPrice[0].shopByPriceTitle}</p>
                            {item.shopByPrice.slice(1).map((child, index) => (
                                <Link key={index} to={child.catUrl} title={child.catTitle} className="shopBy--price--items">
								    {child.catTitle} 
							    </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mainMenu--body-box">
                    <div className="shopBy--wrapper">
                        <div className="shopBy--occasion shopByOccasion">
                            <p className="mainMenu--title">{item.shopByOcassion[0].shopByOcassionTitle}</p>
                            {item.shopByOcassion.slice(1).map((child, index) => (
                                <Link key={index} to={child.catUrl} title={child.catTitle} className="shopBy--occasion--items">
                                    <img src={child.catImage} alt={child.catTitle}
                                        className="shopBy--occasion--items-pics" />
                                    {child.catTitle}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <Link to={item.viewAll.url} title={item.viewAll.viewAllTitle} className='mainMenu--cta base_btn btn_md primary_btn'>{item.viewAll.viewAllTitle}</Link>
            </div>
        ))}
    </div>
    </>
  )
}

export default CategoriesChild
