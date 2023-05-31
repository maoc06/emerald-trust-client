import axios from "axios";
import FormData from "form-data";

const key = process.env.ipfsApiKey;
const secret = process.env.ipfsSecret;
const gateway = process.env.pinataGateway;

export const uploadFileToIPFS = async (file) => {
  // console.log("Uploading file to IPFS...");
  const baseUrl = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const formData = new FormData();
  formData.append("file", file);

  // const metadata = JSON.stringify({
  //   name: "testname",
  //   keyvalues: {
  //     exampleKey: "exampleValue",
  //   },
  // });
  // formData.append("pinataMetadata", metadata);

  return axios
    .post(baseUrl, formData, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      // console.log(`Image uploaded ${response.data.IpfsHash}`);
      return {
        success: true,
        pinataURL: `${gateway}/${response.data.IpfsHash}`,
      };
    })
    .catch(function (error) {
      console.error(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const uploadJSONToIPFS = async (JSONBody) => {
  // console.log("Uploading JSON to IPFS...");
  const baseUrl = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  return axios
    .post(baseUrl, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      // console.log(`JSON uploaded ${response.data.IpfsHash}`);
      return {
        success: true,
        pinataURL: `${gateway}/${response.data.IpfsHash}`,
      };
    })
    .catch(function (error) {
      console.error(error);
      return {
        success: false,
        message: error.message,
      };
    });
};
