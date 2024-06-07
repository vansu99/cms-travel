


export const imageUrlToBase64 = async (url: string) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
    });
  };


export const imgUrlToFileObj = async (imgUrl: string) => 
     new Promise((resolve) => {
        fetch(imgUrl)
        .then((res) => res.blob())
        .then((myBlob) => {
            const myFile = new File([myBlob], 'image-post.jpeg', { type: myBlob.type });
            resolve(myFile);
        });
    })
