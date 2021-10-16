import { createSlice } from '@reduxjs/toolkit';
import { MediaBundle } from '../models/media-bundle-model';

var initialBundle: MediaBundle = {
    Metadata: {
        Version: "0",
        Categories: [
            {
                title: "Old Testament",
                children: [],
            },
            {
                title: "New Testament",
                children: [
                {
                    title: "Luke",
                    children: [
                    { 
                        title: "Luke 1",
                        children: [] 
                    },
                    {
                        title: "Luke 2",
                        children: []
                    }
                    ]
                }
                ],
            },
            {
                title: "Stories",
                children: [],
            },
            {
                title: "Music",
                children: [],
            }
        ]
    },
    Media: []
};

export const metadataSlice = createSlice({
    name: 'metadata',
    initialState: initialBundle,
    reducers: {}
})

export default metadataSlice.reducer;