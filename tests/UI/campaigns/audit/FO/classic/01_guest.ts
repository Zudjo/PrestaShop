import {expect} from 'chai';
import {pricesDropPage} from '@pages/FO/classic/pricesDrop';
import {newProductsPage} from '@pages/FO/classic/newProducts';
import {bestSalesPage} from '@pages/FO/classic/bestSales';
import {deliveryPage} from '@pages/FO/classic/delivery';
import {legalNoticePage} from '@pages/FO/classic/legalNotice';
import {guestOrderTrackingPage} from '@pages/FO/classic/orderTracking/guestOrderTracking';
import {createAccountPage} from '@pages/FO/classic/myAccount/add';
import {termsAndConditionsOfUsePage} from '@pages/FO/classic/termsAndConditionsOfUse';
import {securePaymentPage} from '@pages/FO/classic/securePayment';
import {siteMapPage} from '@pages/FO/classic/siteMap';
import {storesPage} from '@pages/FO/classic/stores';
import testContext from '@utils/testContext';

import {
  type BrowserContext,
  dataCategories,
  dataProducts,
  foClassicAboutUsPage,
  foClassicCategoryPage,
  foClassicContactUsPage,
  foClassicHomePage,
  foClassicLoginPage,
  foClassicProductPage,
  foClassicSearchResultsPage,
  type Page,
  utilsPlaywright,
} from '@prestashop-core/ui-testing';

const baseContext: string = 'audit_FO_classic_guest';

describe('Check FO public pages', async () => {
  let browserContext: BrowserContext;
  let page: Page;

  before(async function () {
    utilsPlaywright.setErrorsCaptured(true);

    browserContext = await utilsPlaywright.createBrowserContext(this.browser);
    page = await utilsPlaywright.newTab(browserContext);
  });

  after(async () => {
    await utilsPlaywright.closeBrowserContext(browserContext);
  });

  it('should go to the home page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToHome', baseContext);

    await foClassicHomePage.goTo(page, global.FO.URL);

    const result = await foClassicHomePage.isHomePage(page);
    expect(result).to.eq(true);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to a category page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToCategory', baseContext);

    await foClassicHomePage.goToCategory(page, dataCategories.clothes.id);

    const pageTitle = await foClassicCategoryPage.getPageTitle(page);
    expect(pageTitle).to.equal(dataCategories.clothes.name);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to a subcategory page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToSubCategory', baseContext);

    await foClassicCategoryPage.goToSubCategory(page, dataCategories.clothes.id, dataCategories.men.id);

    const pageTitle = await foClassicCategoryPage.getPageTitle(page);
    expect(pageTitle).to.equal(dataCategories.men.name);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should go to a product page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToProduct', baseContext);

    await foClassicCategoryPage.goToProductPage(page, 1);

    const pageTitle = await foClassicProductPage.getPageTitle(page);
    expect(pageTitle.toUpperCase()).to.contains(dataProducts.demo_1.name.toUpperCase());

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  it('should search a product', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToSearch', baseContext);

    await foClassicProductPage.searchProduct(page, 'shirt');

    const pageTitle = await foClassicSearchResultsPage.getPageTitle(page);
    expect(pageTitle).to.equal(foClassicSearchResultsPage.pageTitle);

    const jsErrors = utilsPlaywright.getJsErrors();
    expect(jsErrors.length).to.equals(0);
  });

  describe('Check \'Products\' footer links', async () => {
    [
      {linkSelector: 'Prices drop', pageTitle: pricesDropPage.pageTitle},
      {linkSelector: 'New products', pageTitle: newProductsPage.pageTitle},
      {linkSelector: 'Best sellers', pageTitle: bestSalesPage.pageTitle},
    ].forEach((args, index: number) => {
      it(`should check '${args.linkSelector}' footer links`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkProductsFooterLinks${index}`, baseContext);

        await foClassicHomePage.goToFooterLink(page, args.linkSelector);

        const pageTitle = await foClassicHomePage.getPageTitle(page);
        expect(pageTitle).to.equal(args.pageTitle);

        const jsErrors = utilsPlaywright.getJsErrors();
        expect(jsErrors.length).to.equals(0);
      });
    });
  });

  describe('Check \'Our Company\' footer links', async () => {
    [
      {linkSelector: 'Delivery', pageTitle: deliveryPage.pageTitle},
      {linkSelector: 'Legal Notice', pageTitle: legalNoticePage.pageTitle},
      {linkSelector: 'Terms and conditions of use', pageTitle: termsAndConditionsOfUsePage.pageTitle},
      {linkSelector: 'About us', pageTitle: foClassicAboutUsPage.pageTitle},
      {linkSelector: 'Secure payment', pageTitle: securePaymentPage.pageTitle},
      {linkSelector: 'Contact us', pageTitle: foClassicContactUsPage.pageTitle},
      {linkSelector: 'Sitemap', pageTitle: siteMapPage.pageTitle},
      {linkSelector: 'Stores', pageTitle: storesPage.pageTitle},
    ].forEach((args, index: number) => {
      it(`should check '${args.linkSelector}' footer links`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkOurCompanyFooterLinks${index}`, baseContext);

        await foClassicHomePage.goToFooterLink(page, args.linkSelector);

        const pageTitle = await foClassicHomePage.getPageTitle(page);
        expect(pageTitle).to.equal(args.pageTitle);

        const jsErrors = utilsPlaywright.getJsErrors();
        expect(jsErrors.length).to.equals(0);
      });
    });
  });

  describe('Check \'Your Account\' footer links', async () => {
    [
      {linkSelector: 'Order tracking', pageTitle: guestOrderTrackingPage.pageTitle},
      {linkSelector: 'Sign in', pageTitle: foClassicLoginPage.pageTitle},
      {linkSelector: 'Create account', pageTitle: createAccountPage.formTitle},
    ].forEach((args, index: number) => {
      it(`should check '${args.linkSelector}' footer links`, async function () {
        await testContext.addContextItem(this, 'testIdentifier', `checkYourAccountFooterLinks${index}`, baseContext);

        await foClassicHomePage.goToFooterLink(page, args.linkSelector);

        let pageTitle: string = '';

        if (args.linkSelector === 'Create account') {
          pageTitle = await createAccountPage.getHeaderTitle(page);
        } else {
          pageTitle = await foClassicHomePage.getPageTitle(page);
        }
        expect(pageTitle).to.equal(args.pageTitle);
      });
    });
  });
});
