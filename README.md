# soundsynqr
Share and sync youtube audio on twitch

# Installation
Either download the compiled binary from the [chrome store](https://chrome.google.com/webstore/detail/soundsynqr/oaaphmaicdhcjpceibaknalefedehobo) or clone/download this repository and load it in as an uncompressed extension by visiting chrome://extensions

I will in time make it available for Mozilla Firefox now that it got published for Chrome by Google, perhaps within the first week of February. No promises!

Thanks to [jsQR](https://github.com/cozmo/jsQR) and [qrcode.js](http://jeromeetienne.github.com/jquery-qrcode/) for most of the QR functionality

#Chrome description:
Using this extension, twitch streamers can share youtube audio with their audience without having to broadcast copyright infringing material directly.

##For viewers:
Open up a stream that uses soundsynqr and hit the extension button. That's it.

##For streamers:
Use this extension to stream a continuously updating QR code containing all that is needed for your viewers to hear the youtube audio you want to share. Open the video you want to share and press the extension button. A QR code will pop up. Record that QR code using OBS or other streaming software and you're done. Even if you change the video or are viewing a playlist it will not require any interaction as long as you aren't obscuring the QR code.

##How it works:
The QR code that is displayed by soundsynqr on the streamers end contains a video link as well as its timestamp - this is why it changes while the video is playing. Any viewer that has soundsynqr can then hear the audio as their soundsynqr extension automatically reads the QR code and creates an embedded youtube player that always skips to the timestamp indicated by the QR.

Be mindful of the fact that stream snipers might try to show their own QR code on stream. While soundsynqr locks on to the original QR code and ignores the rest of the screen, it is not foolproof. And at the same time, they could do worse things if they are able to display arbitrary images on your stream 🐴. Also, I am not a lawyer - do not interpret anything written by me as legal advice or advice on twitch ToS. Do not use this extension for illicit purposes.

-@thermstr1pe Okayge
