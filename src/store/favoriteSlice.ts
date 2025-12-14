import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FavoriteItem {
    uid: string;
    type: 'FullApartment' | 'Room';
    apartmentUid: string;
}

interface FavoriteState {
    items: FavoriteItem[];
    loading: boolean;
}

const initialState: FavoriteState = {
    items: [],
    loading: false,
}

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        setFavorites: (state, action: PayloadAction<FavoriteItem[]>) => {
            state.items = action.payload;
        },
        addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
            const exists = state.items.some(item => item.apartmentUid === action.payload.apartmentUid);
            if (!exists) {
                state.items.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.apartmentUid !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
})

export const { setFavorites, addFavorite, removeFavorite, setLoading } = favoriteSlice.actions
export default favoriteSlice.reducer
