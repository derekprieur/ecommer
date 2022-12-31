import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { IconButton, Box, Button, Tabs, Tab, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import RemoveIcon from '@mui/icons-material/Remove'
import { shades } from "../../theme"
import { addToCart } from "../../state"
import { useParams } from "react-router-dom"
import Item from "../../components/Item"

const ItemDetails = () => {
    const dispatch = useDispatch()
    const { itemId } = useParams()
    const [value, setValue] = useState('description')
    const [count, setCount] = useState(1)
    const [item, setItem] = useState(null)
    const [items, setItems] = useState([])

    console.log(items?.data?.slice(0, 4), 'item detail items')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    async function getItem() {
        const item = await fetch(`http://localhost:1337/api/items/${itemId}?populate=image`, { method: 'GET' })
        const itemJson = await item.json()
        setItem(itemJson)
    }

    async function getItems() {
        const items = await fetch(`http://localhost:1337/api/items?populate=image`, { method: 'GET' })
        const itemsJson = await items.json()
        setItems(itemsJson)
    }

    useEffect(() => {
        getItem()
        getItems()
    }, [itemId]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box width='80%' m='80px auto'>
            <Box display='flex' flexWrap='wrap' columnGap='40px'>
                {/* Images */}
                <Box flex='1 1 40%' mb='40px'>
                    <img width='100%' height='100%' src={`http://localhost:1337${item?.data?.attributes?.image?.data?.attributes?.formats?.medium?.url}`} style={{ objectFit: 'contain' }} alt={item?.data?.attributes?.name} />
                </Box>
                {/* Actions */}
                <Box flex='1 1 50%' mb='40px'>
                    <Box display='flex' justifyContent='space-between'>
                        <Box>Home/Item</Box>
                        <Box>Prev Next</Box>
                    </Box>
                    <Box m='65px 0 25px 0'>
                        <Typography variant="h3">{item?.data?.attributes?.name}</Typography>
                        <Typography>${item?.data?.attributes?.price}</Typography>
                        <Typography sx={{ mt: '20px' }}>{item?.data?.attributes?.longDescription}</Typography>
                    </Box>
                    {/* Count And Button*/}
                    <Box display='flex' alignItems='center' minHeight='50px'>
                        <Box display='flex' alignItems='center' border={`1.5px solid ${shades.neutral[300]}`} mr='20px' p='2px 5px'>
                            <IconButton onClick={() => setCount(Math.max(count - 1, 1))}>
                                <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ p: '0 5px' }}>{count}</Typography>
                            <IconButton onClick={() => setCount(count + 1)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Button sx={{ backgroundColor: '#222222', color: 'white', borderRadius: 0, minWidth: '150px', padding: '10px 40px' }} onClick={() => dispatch(addToCart({ item: { ...item, count } }))}>ADD TO CART</Button>
                    </Box>
                    <Box>
                        <Box m='20p x 0 5px 0' display='flex'>
                            <FavoriteBorderOutlinedIcon />
                            <Typography sx={{ ml: '5px' }}>Add to wishlist</Typography>
                        </Box>
                        <Typography>CATEGORIES: {item?.data?.attributes?.category}</Typography>
                    </Box>
                </Box>
            </Box>
            {/* Information */}
            <Box m='20px 0'>
                <Tabs value={value} onChange={handleChange}>
                    <Tab value='description' label='DESCRIPTION' />
                    <Tab value='reviews' label='REVIEWS' />
                </Tabs>
            </Box>
            <Box display='flex' flexWrap='wrap' gap='15px'>
                {value === 'description' && <div>{item?.data?.attributes?.longDescription}</div>}
                {value === 'reviews' && <div>reviews</div>}
            </Box>
            {/* Related Items */}
            <Box mt='50px' width='100%'>
                {items?.data?.length > 0 &&
                    <>
                        <Typography Typography variant='h3' fontWeight='bold'>Related Products</Typography>
                        <Box display='flex' flexWrap='wrap' mt='20px' columnGap='1.33%' justifyContent='space-between'>
                            {items?.data?.slice(0, 4).map((item, index) => <Item key={index} item={item} />)}
                        </Box>
                    </>
                }

            </Box>
        </Box >
    )
}

export default ItemDetails