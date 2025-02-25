import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import label from "../../assets/images/label.svg";
import star from "../../assets/images/star.svg";
import close from "../../assets/images/close.svg";
import SectionTitle from '../sectionTitle/SectionTitle';
import { BottomSheet } from 'react-spring-bottom-sheet';
import Filter from '../filter/Filter';
import 'react-spring-bottom-sheet/dist/style.css';
import "./card.scss";
import axios from 'axios';
import { toast } from 'react-toastify';
import { addProductStart, addProductSuccess, addProductFailure, setCartCount } from '../../redux/atcSlice'; 
import { sheetOpen, sheetClose } from '../../redux/bottomSheetSlice';


const Card = ({ item, className }) => {   

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const userToken = useSelector((state) => state.user.token);
    const agent = useSelector((state) => state.agent);
    const {isAdding, cartCount} = useSelector((state) => state.atc);
    const error = useSelector((state) => state.atc.error);
    const showAtc = user.isUser;

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [variant, setVariant] = useState(false);   

    const handleCardClick = useCallback(() => {
        setIsSheetOpen(true);        
    }, []);

    const handleCloseSheet = useCallback(() => {
        setIsSheetOpen(false);
        setVariant(false);
    }, []);

    const handleVariant = useCallback(() => {
        setVariant(true);
    }, []);
    
    const handleAddToCart = () => {
        dispatch(sheetOpen('customerSearchBox'));
    }

    //atc data
//     query: `mutation{\nAddJewelleryProductToCart(input:{\nproduct:\"${product}\"\nselected_configurable_option:\"${selected_configurable_option}"\nrelated_product:\"${related_product}"\nitem:\"${item}\"\nform_key:\"${form_key}\"\nmetal_id:\"${metal_id}\"\npurity_id:\"${purity_id}\"\nclarity_id:\"${clarity_id}\"\nsize_id:\"${size_id}"\nmetal:\"${metal} \"\npurity:\"${purity}\"\nclarity:\"${clarity}\"\nstone_details:\"${stone_details}\"\ngemstone_details:\"${gemstone_details}"\nzirconia_details:\"${zirconia_details}"\nothermaterial_details:\"${othermaterial_details}"\nmetal_size:\"${metal_size}"\ngemstone:\"${gemstone}"\nzirconia:\"${zirconia}"\nengrave_text:\"${engrave_text}"\nengrave_font:\"${engrave_font}"\nmetal_weight:\"${metal_weight}\"\nstone_weight:\"${stone_weight}\"\ngemstone_weight:\"${gemstone_weight}\"\nzirconia_weight:\"${zirconia_weight}\"\nothermaterial_weight:\"${othermaterial_weight}\"\ntotal_weight:\"${total_weight}\"\ncustom_sku:\"${custom_sku}\"\nnecklace_length:\"${necklace_length}"\nproduct_id:\"${product_id}\"\npriorityshipping_id:\"${priorityshipping_id}\"\nis_priority_shipping:\"${is_priority_shipping}\"\nqty:\"${qty}\"\nprice_before_discount:\"${price_before_discount}\"\nprice_after_discount:\"${price_after_discount}\"\ngold_rate:\"${gold_rate}\"\nemail:\"${email}"\ntelephone:\"${telephone}"\n  })\n  {\n    message\n    status\n quote_mask_id\n  }\n  }`,
//     variables: {}
//   });

//

    const addProductToCart = async (item) => {  
        console.log(item)   ;
        try {
            dispatch(addProductStart());    
            let data = JSON.stringify({
                query: `mutation {
                    AddProductToCart(input: {
                        customer_id: ${user.customer_id},
                        product: "${item.product_id}",
                        selected_configurable_option: "",
                        related_product: "",
                        item: "${item.product_id}",
                        form_key: "",
                        metal_id: "${item.product_data?.metal?.[0]?.id ? item.product_data.metal[0].id : ''}",
                        purity_id: "${item.metal_karat_selection}",
                        clarity_id: "${item.diamond_quality ? item.diamond_quality : 0}",
                        size_id: "${item.product_size}",
                        metal: "${item.product_data?.metal?.[0]?.purity ? item.product_data.metal[0].purity : ''} ${item.product_data?.metal?.[0]?.name? item.product_data.metal[0].name : ''} (${item.product_data?.metal?.[0]?.weight ? item.product_data.metal[0].weight : ''})",
                        purity: "${item.product_data?.metal?.[0]?.purity ? item.product_data.metal[0].purity : ''}",
                        clarity: "${item.product_data?.stone?.[0]?.clarity ? item.product_data.stone[0].clarity : ''}",
                        stone_details: "${item.roduct_data?.stone?.[0]?.weight ? item.roduct_data?.stone?.[0]?.weight : ''}",
                        gemstone_details: "",
                        zirconia_details: "",
                        othermaterial_details: "",
                        metal_size: "",
                        gemstone: "",
                        zirconia: "",
                        engrave_text: "",
                        engrave_font: "",
                        metal_weight: "${item.product_data?.metal?.[0]?.weight ? item.product_data.metal[0].weight : ''}",
                        stone_weight: "${item.roduct_data?.stone?.[0]?.weight ? item.roduct_data?.stone?.[0]?.weight : ''}",
                        gemstone_weight: "",
                        zirconia_weight: "",
                        othermaterial_weight: "${item.product_data.othermaterial?.weight || 0}",
                        total_weight: "${item.product_data.total_weight}",
                        custom_sku: "",
                        necklace_length: "",
                        product_id: "${item.product_id}",
                        priorityshipping_id: "${item.priorityshipping_id || 0}",
                        is_priority_shipping: "1",
                        qty: ${item.qty},
                        price_before_discount: "${item.product_data.price || 0}",
                        price_after_discount: "${item.product_data.discount_applied_price || 0}",
                        gold_rate: "",
                        email: "",
                        telephone: "",
                        agentCode: "${agent.agentCodeOrPhone}",
                        storeCode: "${agent.storeCode}"
                    }) {
                        quoteId
                        status
                        message
                        quoteMask
                        statusCode
                    }
                }`,
                variables: {}
            });
    
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: '/graphql',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`, 
                },
                data: data
            };
    
            const response = await axios.request(config);
            console.log(JSON.stringify(response.data));
            console.log(response.data.data.AddProductToCart.status);
            const { quoteId, quoteMask, status } = response.data.data.AddProductToCart;
    
            if (status === "success") {
                dispatch(addProductSuccess({ item, quoteId, quoteMask }));
                setIsSheetOpen(false);
                dispatch(setCartCount(cartCount+1));
                toast.success("Item Added Successfully", {
                    position: "bottom-center",
                    theme: "colored",
                    autoClose: 1500,
                });
            } else {
                dispatch(addProductFailure('Failed to add product to cart.'));
                toast.error("Failed to add product to cart.");
                setIsSheetOpen(false);
            }
        } catch (error) {
            dispatch(addProductFailure('An error occurred.'));
            toast.error(error.message);
            setIsSheetOpen(false);
        }
    };

    return (
        <>
            <div className={`${className} card`} onClick={handleCardClick}>
                <div className="card--info">
                    <img src={label} alt="Trending" className="img-fluid card--info-label" />
                    <div className="card--info-details">
                        <p className="card--info-details-rating card--info-details-child">4.5
                            <span><img src={star} alt="Star" className="img-fluid" /></span>
                        </p>
                        <p className="card--info-details-review card--info-details-child">(48)</p>
                    </div>
                </div>
                <div className="card--image">
                    <img src={item.product_data.images[0].metal_image} alt={item.product_name} className="img-fluid" />
                </div>
                <div className="card--content">
                    <p className="card--content-name">{item.product_name}</p>
                    {
                        item.product_data.discount_applied_price ? (
                            <>
                                <div className="card--price">
                                    <p className="card--price-new">&#8377;{Math.trunc(item.product_data.discount_applied_price)}</p>
                                    <p className="card--price-old">&#8377;{Math.trunc(item.product_data.price)}</p>
                                </div>
                                <p className="card--offer">
                                    {item.product_data.discount_label}
                                </p>
                            </>
                        ) : (
                            <>
                            <div className="card--price">
                                <p className="card--price-new">&#8377;{Math.trunc(item.product_data.price)}</p>
                            </div>
                            <p className="card--content-name">
                                {item.product_data.sku}
                            </p>
                            </>
                        )
                    }
                </div>
            </div>

            {!variant &&
                <BottomSheet
                    open={isSheetOpen}
                    onDismiss={handleCloseSheet}
                    defaultSnap={({ snapPoints, lastSnap }) =>
                        lastSnap ?? Math.min(...snapPoints)
                    }
                    snapPoints={({ maxHeight }) => [
                        maxHeight - maxHeight / 7,
                        maxHeight * 0.95,
                    ]}
                    header={
                        <div className='sheetHeader'>
                            <SectionTitle title="Products Details" />
                            <div className='sheetHeader--close' onClick={handleCloseSheet}>
                                <img src={close} alt='BottomSheet Close' className='img-fluid' />
                            </div>
                        </div>
                    }
                    footer={
                        <div className='sheetFooter'>
                            {/* {showAtc && } */}
                            <button
                                className="addProduct base_btn btn_lg primary_btn"
                                //onClick={() => addProductToCart(item)}

                                onClick={() => {
                                    if (showAtc) {
                                        addProductToCart(item)
                                    } else {
                                        handleAddToCart();
                                    }
                                }}


                                disabled={isAdding}
                                >
                                {isAdding ? 'Adding to cart...' : 'Add Product'}
                            </button>
                        </div>
                    }
                >
                    <div className='sheetBody' style={{ marginTop: 0 }}>
                        <Filter productID={item.priorityshipping_id} />
                    </div>
                </BottomSheet>
            }

            {variant &&
                <BottomSheet
                    open={isSheetOpen}
                    onDismiss={handleCloseSheet}
                    defaultSnap={({ snapPoints, lastSnap }) =>
                        lastSnap ?? Math.min(...snapPoints)
                    }
                    snapPoints={({ maxHeight }) => [
                        maxHeight - maxHeight / 2.5,
                        maxHeight * 0.7,
                    ]}
                    header={
                        <div className='sheetHeader'>
                            <SectionTitle title="Product Details" />
                            <div className='sheetHeader--close' onClick={handleCloseSheet}>
                                <img src={close} alt='BottomSheet Close' className='img-fluid' />
                            </div>
                        </div>
                    }
                    footer={
                        <div className='sheetFooter'>
                            <div className="viewSummary base_btn btn_lg primary_btn" onClick={handleVariant}>Select Variant</div>
                            <div className="addProduct base_btn btn_lg secondary_btn">Add Product</div>
                        </div>
                    }
                >
                    <div className='sheetBody' style={{ marginTop: 0 }}>
                        test
                    </div>
                </BottomSheet>
            }
        </>
    );
}

export default Card;
