const imageKitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
const ImageKitAuth = Buffer.from(`${imageKitPrivateKey}:`).toString("base64");
export default ImageKitAuth;
