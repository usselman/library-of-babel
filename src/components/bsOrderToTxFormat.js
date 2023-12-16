export const bsOrderToTxFormat = (bsvOrder) => {
    // Parse the input BSV ordinal outpoint into its components
    const txidHex = bsvOrder.substring(0, 64); // Extract the first 64 characters as txid
    const outputIndexHex = bsvOrder.substring(64); // Extract the remainder as outputIndex in hexadecimal

    // Convert txid to little-endian format
    const txidBytes = Buffer.from(txidHex, 'hex').reverse();

    // Convert output index to uint32LE (4 bytes)
    const outputIndex = Buffer.alloc(4);
    //outputIndex.writeUInt32LE(parseInt(outputIndexHex, 16));

    // Concatenate txid and output index to get the final buffer
    const txFormatBuffer = Buffer.concat([txidBytes, outputIndex]);

    // Convert the buffer to a hexadecimal string
    const txFormatHex = txFormatBuffer.toString('hex');

    return txFormatHex;
};