const fs = require('fs');
const v2Backup = JSON.parse(fs.readFileSync('./listen1_backup.json', 'utf-8'));

let setting = {
    language: v2Backup.language,
    theme: v2Backup.theme,
    playerSetting: v2Backup["player-settings"],
}

let v3_default_settings = [
    {
        "key": "enableAutoChooseSource",
        "value": false
    },
    {
        "key": "enableGlobalShortCut",
        "value": false
    },
    {
        "key": "enableLyricFloatingWindow",
        "value": false
    },
    {
        "key": "enableLyricFloatingWindowTranslation",
        "value": false
    },
    {
        "key": "enableLyricTranslation",
        "value": false
    },
    {
        "key": "enableNowplayingBitrate",
        "value": false
    },
    {
        "key": "enableNowplayingComment",
        "value": false
    },
    {
        "key": "enableNowplayingCoverBackground",
        "value": false
    },
    {
        "key": "enableNowplayingPlatform",
        "value": false
    },
    {
        "key": "enableStopWhenClose",
        "value": true
    },
    {
        "key": "favorite_playlist_order",
        "value": []
    },
    {
        "key": "language",
        "value": "zh-CN"
    },
    {
        "key": "lyricFontSize",
        "value": 15
    },
    {
        "key": "lyricFontWeight",
        "value": 400
    },
    {
        "key": "my_playlist_order",
        "value": [
            "myplaylist_redheart",
            "myplaylist_75390912-a84c-4d74-87d5-457ee420e950"
        ]
    },
    {
        "key": "playerSettings",
        "value": {

        }
    },
    {
        "key": "theme",
        "value": "black"
    }
]

let version = "3";

function getCurrentPlayinglistTracks(v2BackupJSON) {
    const tracks = v2BackupJSON["current-playing"];
    const formattedTracks = [];

    for (const track of tracks) {
        delete track.disabled;
        track.playlist = "current";
        formattedTracks.push(track);
    }

    return formattedTracks;
}
function getMyPlaylistTrack(v2BackupJSON) {
    const playerlists = v2BackupJSON.playerlists;
    const formattedTracks = [];

    for (const playlistId of playerlists) {
        const playlist = v2BackupJSON[playlistId];
        const tracks = playlist.tracks;
        const playlistName = playlist.info.title;

        for (const track of tracks) {
            delete track.disabled;
            delete track.index;
            delete track.playNow;
            delete track.platformText;

            track.playlist = playlistId;
            formattedTracks.push(track);
        }
    }
    return formattedTracks;
}

function getMyPlaylist(v2BackupJSON) {
    const playerlists = v2BackupJSON["playerlists"];
    const formattedLists = [];

    for (let i = 0; i < playerlists.length; i++) {
        const playlistId = playerlists[i];
        const playlistData = v2BackupJSON[playlistId];

        const formattedPlaylist = {
            cover_img_url: playlistData.info.cover_img_url,
            title: playlistData.info.title,
            id: playlistData.info.id,
            source_url: playlistData.info.source_url,
            type: "my",
            order: playlistData.tracks.map(track => track.id)
        };

        formattedLists.push(formattedPlaylist);
    }

    return formattedLists;
}
function getFavoritePlaylist(v2BackupJSON) {
    const favoritePlayerLists = v2BackupJSON.favoriteplayerlists || [];
    const formattedLists = [];

    for (let i = 0; i < favoritePlayerLists.length; i++) {
        const playlistId = favoritePlayerLists[i];
        const playlistData = v2BackupJSON[playlistId];

        const formattedPlaylist = {
            id: playlistData.info.id,
            cover_img_url: playlistData.info.cover_img_url,
            title: playlistData.info.title,
            description: "",
            source_url: playlistData.info.source_url,
            type: "favorite"
        };

        formattedLists.push(formattedPlaylist);
    }

    return formattedLists;
}

function getCurrentPlayinglist(v2BackupJSON) {
    if (!v2BackupJSON || !v2BackupJSON["current-playing"]) {
        console.log("current-playing does not exist");
        return []; // 返回一个空数组
    }

    const order = v2BackupJSON["current-playing"].map(item => item.id);
    const currentObject = {
        id: "current",
        title: "current",
        cover_img_url: "",
        type: "current",
        order: order
    };
    return [currentObject]; // 返回一个包含 currentObject 的数组
}

function getPlaylists() {
    const currentPlayingList = getCurrentPlayinglist(v2Backup);
    const myPlaylist = getMyPlaylist(v2Backup);
    const favoritePlaylist = getFavoritePlaylist(v2Backup);
    return currentPlayingList.concat(myPlaylist, favoritePlaylist);
}
function setPlayerSetting() {
    // 获取语言配置
    // TODO 先不做 就当作默认的语言
    // 获取皮肤设置
    // TODO 暂时不处理 就采用默认皮肤

    // the current playing track id
    let playerSettingsValue;
    // 遍历 v3_default_settings 数组
    for (let index = 0; index < v3_default_settings.length; index++) {
        // 找到 key 为 "playerSettings" 的项
        if (v3_default_settings[index].key === "playerSettings") {
            // 获取对应的 value
            playerSettingsValue = v3_default_settings[index].value;
            break;
        }
    }
    playerSettingsValue = setting.playerSetting; // 修改默认配置
    // console.log(playerSettingsValue);
}

function setPlaylistOrder(playlists, v3DefaultSettings) {
    const myPlaylistIds = [];

    for (const playlist of playlists) {
        if (playlist.type === "my") {
            myPlaylistIds.push(playlist.id);
        }
    }

    for (const setting of v3DefaultSettings) {
        if (setting.key === "my_playlist_order") {
            setting.value = myPlaylistIds;
            break;
        }
    }
}

function setCurrentPlayingTrack(id, tracks) {
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i].id === id) {
            tracks[i].highlight = true;
            break;
        }
    }
}

function getTracks() {
    const myPlaylistTracks = getMyPlaylistTrack(v2Backup);
    const currentPlayinglistTracks = getCurrentPlayinglistTracks(v2Backup);
    const mergedTracks = myPlaylistTracks.concat(currentPlayinglistTracks);
    return mergedTracks;
}

function configV3Backup() {
    v3Backup = {
        "Tracks": getTracks(),
        "Settings": [],
        "Playlists": getPlaylists(),
        "version": "3"
    }
    setPlayerSetting()
    setCurrentPlayingTrack(setting.playerSetting.nowplaying_track_id, v3Backup["Tracks"]);
    setPlaylistOrder(v3Backup.Playlists, v3_default_settings);
    v3Backup.Settings = v3_default_settings;
    console.log(JSON.stringify(v3Backup))
    return v3Backup
}

function exportToJsonFile(data, filePath) {
    const jsonString = JSON.stringify(data, null, 2);
    
    fs.writeFile(filePath, jsonString, 'utf-8', (err) => {
        if (err) {
            console.error('写入文件时发生错误:', err);
        } else {
            console.log('JSON 文件已成功导出。');
        }
    });
}

function exportV3Backup() {
    const v3BackupData = configV3Backup();
    const filePath = './listen1_backup_v3.json';
    exportToJsonFile(v3BackupData, filePath);
}

exportV3Backup()

