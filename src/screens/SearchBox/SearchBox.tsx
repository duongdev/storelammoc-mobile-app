import debounce from 'lodash/debounce'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import numeral from 'numeral'

import React, { Component } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native'

import withStatusBar from 'hocs/status-bar'
import { compose } from 'recompose'

import { NavigationComponent } from 'react-navigation'

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Input,
  Item,
  Left,
  ListItem,
  Right,
  Text,
  Thumbnail,
  View,
} from 'native-base'

import colors from 'constants/colors'
import env from 'constants/env'

import { quickSearch } from 'services/product'

import images from 'assets/images'

interface SearchBoxProps extends NavigationComponent {}

interface IProduct {
  [key: string]: unknown
  id: string
  slug: string
  name: string
  variants: Array<{
    name: string
    sku: string
    price: string
    images: string[]
    [key: string]: unknown
  }>
}

interface SearchBoxState {
  error: any
  products: Array<IProduct>
  isLoading: boolean
  value: string
}

class SearchBox extends Component<SearchBoxProps, SearchBoxState> {
  state = {
    error: null,
    products: [],
    isLoading: false,
    value: '',
  }

  isAndroid = Platform.OS === 'android'

  postMessageToWeb = get(this.props.navigation, 'state.params.postMessageToWeb')

  searchText = get(this.props.navigation, 'state.params.searchText')

  componentDidMount() {
    StatusBar.setBarStyle('dark-content')
    this.setState(
      {
        value: this.searchText,
      },
      () => {
        this.search(this.state.value)
      },
    )
  }

  componentWillUnmount() {
    const { navigation } = this.props
    const barStyle = get(navigation, 'state.params.barStyle') || 'light-content'
    StatusBar.setBarStyle(barStyle)

    this.postMessageToWeb(`product-search:${this.state.value}`)
  }

  handleGoBack = () => {
    this.props.navigation.pop()
  }

  handleGoToTop = () => {
    this.props.navigation.popToTop()
  }

  openBarCodeScanner = () => {
    this.props.navigation.navigate('BarCodeScanner')
  }

  async _search(text: string) {
    if (isEmpty(text)) {
      return
    }

    this.setState({ isLoading: true })

    try {
      const { products } = await quickSearch(text)
      this.setState({
        products,
      })
    } catch (error) {
      console.error(error)
    }

    this.setState({ isLoading: false })
  }
  search = debounce(this._search, 1000)

  handleChangeText = async (value: string) => {
    this.setState({
      value,
      isLoading: !isEmpty(value),
    })

    await this.search(value)
  }

  handleProductPress = (product: IProduct) => {
    this.handleGoToTop()
    return this.postMessageToWeb(`product-view-nav:${product.slug}`)
  }

  keyExtractor = (item: IProduct, index: number) => item.id

  renderItem = ({ item, index }: { item: IProduct; index: number }) => {
    const source = get(item, 'images[0]')
      ? { uri: `${env.API_URL}/files/${get(item, 'images[0]')}?size=thumb` }
      : images.logo
    const price = Number(get(item, 'variants[0].price', 0))
    const variants = item.variants

    return (
      <ListItem
        key={item.id}
        thumbnail
        onPress={() => this.handleProductPress(item)}
      >
        <Left>
          <Thumbnail source={source} />
        </Left>
        <Body>
          <Text>{item.name}</Text>
          <Text note>{`${map(variants.slice(0, 3), variant => {
            return variant.name
          })}...`}</Text>
        </Body>
        <Right>
          <Text>{`${numeral(price).format('0,0')}₫`}</Text>
        </Right>
      </ListItem>
    )
  }

  renderEmpty = () => {
    if (isEmpty(this.state.value)) {
      return null
    }

    return (
      <View style={styles.emptyContainer}>
        <Text>{'Không tìm thấy sản phẩm nào phù hợp'}</Text>
      </View>
    )
  }

  render() {
    return (
      <Container>
        <Header
          style={{ ...StyleSheet.flatten(styles.headerContainer) }}
          androidStatusBarColor={colors.transparent}
        >
          <Left style={{ ...StyleSheet.flatten(styles.leftHeader) }}>
            <Button transparent onPress={this.handleGoBack}>
              <MaterialIcons name="arrow-back" size={25} color={colors.black} />
            </Button>
          </Left>
          <View style={styles.textInputContainer}>
            <Item>
              <MaterialIcons name="search" size={20} color={colors.black} />
              <Input
                placeholder="Tìm kiếm..."
                style={styles.textInput}
                onChangeText={this.handleChangeText}
                value={this.state.value}
                autoFocus
                selectTextOnFocus
              />
            </Item>
          </View>
          <Right style={{ ...StyleSheet.flatten(styles.rightHeader) }}>
            <Button transparent onPress={this.openBarCodeScanner}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={25}
                color={colors.black}
              />
            </Button>
          </Right>
        </Header>
        <Content padder>
          <FlatList
            data={this.state.products}
            renderItem={this.renderItem}
            ListEmptyComponent={this.renderEmpty}
            keyExtractor={this.keyExtractor}
          />
          {this.state.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator />
            </View>
          )}
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    paddingTop: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
    padding: 20,
    backgroundColor: colors.whiteOpacity,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftHeader: {
    flex: 0,
    paddingRight: 10,
  },
  rightHeader: {
    flex: 0,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
  },
})

export default compose(
  withStatusBar({
    hidden: false,
    backgroundColor: colors.white,
    barStyle: 'dark-content',
  }),
)(SearchBox)
