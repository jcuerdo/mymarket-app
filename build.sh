rm MyMarketAtHome.apk
rm app-release-unsigned.apk
ionic cordova build android --release --prod
mv /Users/jcuerdo/code/mymarket-app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk /Users/jcuerdo/code/mymarket-app
#keytool -genkey -v -keystore my-market.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-market
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-market.jks app-release-unsigned.apk my-market
~/Library/Android/sdk/build-tools/28.0.1/zipalign -v 4 app-release-unsigned.apk MyMarketAtHome.apk