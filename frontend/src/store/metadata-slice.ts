import { createSlice } from '@reduxjs/toolkit';

var metadata = [
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
];

export const metadataSlice = createSlice({
    name: 'metadata',
    initialState: metadata,
    reducers: {}
})