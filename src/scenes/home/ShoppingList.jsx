import { useEffect, useState } from "react"
import { Box, Typography, Tab, Tabs, useMediaQuery } from '@mui/material'
import Item from '../../components/Item'
import { useDispatch, useSelector } from "react-redux"
import { setItems } from "../../state"

const ShoppingList = () => {
    const dispatch = useDispatch()
    const [value, setValue] = useState('all')
    const items = useSelector(state => state.cart.items)
    const isNonMobile = useMediaQuery('(min-width:600px)')

    console.log(items, 'shopping list items')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    async function getItems() {
        const items = await fetch('http://localhost:1337/api/items?populate=image', { method: 'GET' })
        const itemsJson = await items.json()
        dispatch(setItems(itemsJson.data))
    }

    useEffect(() => {
        getItems()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const topRatedItems = items.filter(item => item.attributes.category === 'topRated')
    const newArrivals = items.filter(item => item.attributes.category === 'newArrivals')
    const bestSellers = items.filter(item => item.attributes.category === 'bestSellers')

    return (
        <Box width='80%' margin='80px auto'>
            <Typography variant="h3" textAlign='center'>
                Our Featured <b>Products</b>
            </Typography>
            <Tabs textColor="primary" indicatorColor="primary" value={value} onChange={handleChange} centered TabIndicatorProps={{ sx: { display: isNonMobile ? 'block' : 'none' } }} sx={{ m: '25px', '& .MuiTabs-flexContainer': { flexWrap: 'wrap' } }}>
                <Tab label="ALL" value="all" />
                <Tab label="NEW ARRIVALS" value="newArrivals" />
                <Tab label="BEST SELLERS" value="bestSellers" />
                <Tab label="TOP RATED" value="topRated" />
            </Tabs>
            <Box margin='0 auto' display='grid' gridTemplateColumns='repeat(auto-fill, 300px)' justifyContent='space-around' rowGap='20px' columnGap='1.33%'>
                {value === 'all' && items.map(item => <Item key={`${item.name}-${item.id}`} item={item} />)}
                {value === 'newArrivals' && newArrivals.map(item => <Item key={`${item.name}-${item.id}`} item={item} />)}
                {value === 'topRated' && topRatedItems.map(item => <Item key={`${item.name}-${item.id}`} item={item} />)}
                {value === 'bestSellers' && bestSellers.map(item => <Item key={`${item.name}-${item.id}`} item={item} />)}
            </Box>
        </Box>
    )
}

export default ShoppingList