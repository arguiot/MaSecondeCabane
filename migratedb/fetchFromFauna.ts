import { AllConfigs, AllOrders, AllProducts, AllRequests } from "../lib/Requests";
import { graphQLClient } from "../utils/fauna";

const backupDB = async () => {
    const backupData: {
        [key: string]: any[];
    } = {};

    // fetch all data from respective collections
    try {
        // backup product data
        const productResponse = await graphQLClient.request(AllProducts, { size: 10000 });
        backupData['products'] = productResponse.allProducts?.data;

        // backup order data
        const orderResponse = await graphQLClient.request(AllOrders, { size: 10000 });
        backupData['orders'] = orderResponse.allOrders?.data;

        // backup request data
        const requestResponse = await graphQLClient.request(AllRequests, { size: 10000 });
        backupData['requests'] = requestResponse.allRequest?.data;

        // backup configs data
        const configResponse = await graphQLClient.request(AllConfigs, { size: 10000 });
        backupData['configs'] = configResponse.allConfigs?.data;

        const fs = require('fs');
        fs.writeFileSync('backup.json', JSON.stringify(backupData, null, 2), 'utf-8');
        console.log("Database has been successfully backed up to backup.json");
    } catch (error) {
        console.error('Failed to back up the data', error);
    }
};

backupDB();