import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import numeral from 'numeral'

import debounce from 'lodash-decorators/debounce'

import React, { Component } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
} from 'react-native'

import withNavigatorFocused, {
  WithNavigatorFocused,
} from 'hocs/withNavigatorFocused'
import withStatusBar from 'hocs/withStatusBar'
import { compose } from 'recompose'

import { NavigationComponent } from 'react-navigation'

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import {
  Body,
  Button,
  Container,
  Header,
  Item,
  Left,
  ListItem,
  Right,
  Text,
  Thumbnail,
  View,
} from 'native-base'

import { searchByText } from 'services/product-services'

import colors from 'constants/colors'
import global from 'constants/global'

import images from 'assets/images'

type SearchBoxProps = NavigationComponent & WithNavigatorFocused

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
  loading: boolean
  searchText: string
}

class SearchBox extends Component<SearchBoxProps, SearchBoxState> {
  state = {
    error: null,
    products: [],
    loading: false,
    searchText: '',
  }

  isAndroid = Platform.OS === 'android'

  postMessageToWeb = get(this.props.navigation, 'state.params.postMessageToWeb')

  searchText = get(this.props.navigation, 'state.params.searchText')

  componentDidMount() {
    StatusBar.setBarStyle('dark-content')
    this.setState(
      {
        searchText: this.searchText,
      },
      () => {
        this.search(this.state.searchText)
      },
    )
  }

  componentWillUnmount() {
    const { navigation } = this.props
    const barStyle = get(navigation, 'state.params.barStyle') || 'light-content'
    StatusBar.setBarStyle(barStyle)

    this.postMessageToWeb('product-search', this.state.searchText)
  }

  componentDidUpdate(prevProps: SearchBoxProps) {
    if (this.props.navigatorFocused && !prevProps.navigatorFocused) {
      this.searchBox && this.searchBox.focus()
    }
  }

  handleGoBack = () => {
    this.props.navigation.pop()
  }

  handleGoToTop = () => {
    this.props.navigation.popToTop()
  }

  openBarCodeScanner = () => {
    this.props.navigation.navigate('BarCodeScanner', {
      postMessageToWeb: this.postMessageToWeb,
    })
  }

  @debounce(500)
  async search(text: string) {
    if (isEmpty(text)) {
      return
    }

    this.setState({ loading: true })

    try {
      const { products, text: prevText } = await searchByText(text)

      if (prevText !== this.state.searchText) return

      this.setState({
        products,
      })
    } catch (error) {
      console.error(error)
    }

    this.setState({ loading: false })
  }

  handleChangeText = async (searchText: string) => {
    this.setState({
      searchText,
    })

    await this.search(searchText)
  }

  handleProductPress = (product: IProduct) => {
    this.handleGoToTop()
    const data = {
      slug: product.slug,
    }

    return this.postMessageToWeb('product-view-nav', data)
  }

  keyExtractor = (item: IProduct, index: number) => item.id

  renderItem = ({ item, index }: { item: IProduct; index: number }) => {
    const source = get(item, 'images[0]')
      ? { uri: `${global.API_URL}/files/${get(item, 'images[0]')}?size=thumb` }
      : images.logo
    const price = Number(get(item, 'variants[0].price', 0))
    const variants = item.variants || []

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
          }).join('; ')}${variants.length > 3 ? '...' : ''}`}</Text>
        </Body>
        <Right>
          <Text>{`${numeral(price).format('0,0')}₫`}</Text>
        </Right>
      </ListItem>
    )
  }

  renderEmpty = () => {
    if (isEmpty(this.state.searchText)) {
      return null
    }

    return (
      <View style={styles.emptyContainer}>
        <Text>{'Không tìm thấy sản phẩm nào phù hợp'}</Text>
      </View>
    )
  }

  searchBox: TextInput | null = null
  render() {
    const { loading } = this.state

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
              <TextInput
                ref={(inst: any) => (this.searchBox = inst)}
                placeholder="Tìm kiếm..."
                style={styles.textInput}
                onChangeText={this.handleChangeText}
                value={this.state.searchText}
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
        <View style={styles.contentContainer}>
          <FlatList
            data={this.state.products}
            renderItem={this.renderItem}
            ListEmptyComponent={!loading ? this.renderEmpty : null}
            keyExtractor={this.keyExtractor}
          />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator />
            </View>
          )}
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.white,
    paddingTop: 0,
    paddingLeft: Platform.OS === 'ios' ? 8 : 0,
    paddingRight: Platform.OS === 'ios' ? 8 : 0,
  },
  contentContainer: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    paddingTop: 20,
    backgroundColor: colors.whiteOpacity,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftHeader: {
    flex: 0,
    paddingRight: 8,
    paddingLeft: 8,
  },
  rightHeader: {
    flex: 0,
    paddingRight: 8,
    paddingLeft: 8,
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    top: 1.5,
    fontSize: 17,
    paddingHorizontal: 5,
    height: 50,
  },
})

export default compose(
  withStatusBar({
    hidden: false,
    backgroundColor: colors.white,
    barStyle: 'dark-content',
  }),
  withNavigatorFocused,
)(SearchBox)
