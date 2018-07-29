# houm-tradfri

## Create devices in Houm

```
./npm.sh install
TRADFRI_QR_CODE="xx-xx-xx-xx-xx-xx,xxxxxxxxxxxxxxxx" \
ROOM_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" \
SITE_KEY="xxxxxx-xxxxxx-xxxxxx" \
DRIVER_ENDPOINT="https://192.168.1.10:3000" \
./npm.sh run create-devices
```


## Run Trådfri Driver

```
./npm.sh install
TRADFRI_QR_CODE="xx-xx-xx-xx-xx-xx,xxxxxxxxxxxxxxxx" \
PORT="3000" \
./npm.sh start
```
