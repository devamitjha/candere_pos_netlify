import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sheetClose } from '../../redux/bottomSheetSlice';
import { setProducts, setLoading, setTotalProducts, setProductType, clearProducts } from '../../redux/productSlice';
import { setSelectedStore } from '../../redux/nearbyStoreSlice';
import { fetchProductsData } from '../../services/fetchProductData';
import './StoreAddress.scss';
// import directions from '../../assets/images/directions.svg';

const StoreAddress = () => {
    const dispatch = useDispatch();
    const nearbyStores = useSelector((state) => state.nearbyStore.nearbyStores);
    const { agentCodeOrPhone } = useSelector((state) => state.agent);
    const { customer_id } = useSelector((state) => state.user);
    const [page, setPage] = useState(1);
    const [categoriesName, setCategoriesName] = useState('');
    const [agentData, setAgentData] = useState(null);

    useEffect(() => {
        const storedAgentData = localStorage.getItem('agentData');
        if(storedAgentData) {
            setAgentData(JSON.parse(storedAgentData));
        }
    }, []);

    const fetchProducts = async (currentPage, storeCode) => {
        dispatch(setLoading(true));
        try {
            const productResponseData = await fetchProductsData(
                storeCode,
                agentCodeOrPhone,
                customer_id,
                categoriesName,
                currentPage
            );
            if (productResponseData.data.status === 'success') {
                dispatch(setProducts(productResponseData.data.products));
                dispatch(setProductType(productResponseData.data.product_types));
                dispatch(setTotalProducts(productResponseData.data.productCount));
            }
        } catch (error) {
            console.error('Error Fetching data:', error);
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    const handleStoreSelect = (store_code, storeName) => {
        dispatch(clearProducts());
        fetchProducts(1, store_code);
        // const selectedStore = nearbyStores?.find(store => store.store_code === store_code);
        const selectedStore = {
            code: store_code,
            name: storeName
        };

        // const selectedStore = storeName
        if (selectedStore) {
            dispatch(setSelectedStore(selectedStore));
        }
        dispatch(sheetClose());
    };
    
  return (
    <div className='storeAddress-wrapper'>
        {agentData ? (
            <div className='storeAddress' onClick={() => handleStoreSelect(agentData.storeCode, agentData.storeName)}>
                <div className="storeAddress-left">
                    <div className='storeAddress--content'>
                        <p className='storeAddress--content-title'>{agentData.storeName}</p>
                        <p className='storeAddress--content-para'>{agentData.storeAddress}</p>
                        {agentData.storePhone && <p className='storeAddress--content-para'>Phone - {agentData.storePhone}</p>}                        
                    </div>
                </div>
            </div>
        ) : (
            <p>No Agent data available</p>
        )}
            
        {nearbyStores.map((store) => (
            <div key={store.store_code} className='storeAddress' onClick={() => handleStoreSelect(store.store_code, store.place_name)}>
                <div className="storeAddress-left">
                    <div className='storeAddress--content'>
                        <p className='storeAddress--content-title'>{store.place_name}</p>
                        <p className='storeAddress--content-para'>{store.address}</p>
                        {store.phone && <p className='storeAddress--content-para'>Phone - {store.phone}</p> }                        
                    </div>
                </div>
                {/* <div className="storeAddress-right">
                    <div className='storeAddress--map'>
                        <img src={directions} alt={store.place_name} />
                        <p className='storeAddress--map-distance'>12 KM</p>
                    </div>
                </div> */}
            </div>
        ))}
    </div>
  )
}

export default StoreAddress
