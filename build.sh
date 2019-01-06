rm MyMarketAtHome.apk
rm app-release-unsigned.apk
ionic cordova build android --release --prod
mv platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./
#keytool -genkey -v -keystore my-market.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-market
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-market.jks app-release-unsigned.apk my-market
~/Library/Android/sdk/build-tools/26.0.2/zipalign -v 4 app-release-unsigned.apk MyMarketAtHome.apk
