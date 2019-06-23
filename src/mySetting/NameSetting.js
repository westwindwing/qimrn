import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    NativeModules,
    DeviceEventEmitter,
    Alert,
    Platform,
} from 'react-native';
import NavCBtn from "../common/NavCBtn";

export default class NameSetting extends Component {

    static navigationOptions = ({navigation}) => {
        let headerTitle = "修改名称";
        // console.log(headerTitle);
        let props = {navigation: navigation, btnType: NavCBtn.BACK_BUTTON};
        let leftBtn = (<NavCBtn {...props}/>);
        let rightBtn = (<NavCBtn btnType={NavCBtn.NAV_BUTTON} onPress={() => {
            if (navigation.state.params.onSavePress) {
                navigation.state.params.onSavePress();
            }
        }}>保存</NavCBtn>);
        return {
            headerTitle: headerTitle,
            headerTitleStyle: {
                fontSize: 14
            },
            headerLeft: leftBtn,
            headerRight: rightBtn,
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.navigation.state.params.userId,
            remark: this.props.navigation.state.params.remark,
            name: this.props.navigation.state.params.name,
        }
        this.unMount = false;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onSavePress: this.onSaveName.bind(this),
        });
    }

    componentWillUnmount() {
        this.unMount = true;
    }

    onSaveName() {
        let parma = {};
        if (this.state.userId === '' || this.state.userId === null) {
            return;
        }
        parma["UserId"] = this.state.userId;
        parma["Name"] = this.state.name;
        NativeModules.QbcImRNBModule.setHostUserName(parma, function (responce) {
            if (responce.ok) {
                DeviceEventEmitter.emit("updateName", parma);
                this.props.navigation.goBack();
            } else {
                Alert.alert("提示", "设置失败");
            }


        }.bind(this));
    }

    personalNickChangeText(text) {
        if (Platform.OS === 'ios') {
            this.remarkText = text;
        } else {
            this.setState({name:text});
        }
    }
    render() {
        return (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <View style={styles.line}/>
                <View style={styles.remarks}>
                    <View style={styles.cellContentView}>
                        <Text>姓名：</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="请输入要设置的名称"
                            defaultValue={this.state.name}
                            onChangeText={(text) => this.personalNickChangeText(text)}
                            underlineColorAndroid='transparent'
                            clearButtonMode="while-editing"
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}
var styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#EAEAEA",
    },
    contentContainer: {
        // paddingVertical: 20
    },
    remarks: {
        height: 50
    },
    line: {
        height: 10,
    },
    cellContentView: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        height: 44,
        borderBottomWidth: 1,
        borderColor: "#EAEAEA",
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
        flex: 1,
    },
    textInput: {
        flex: 1,
        height: 40,
        backgroundColor: "#FFF",
    }
});
