import '../../helpers/env';
import DomMock from '../../helpers/dom-mock';
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import UserList from '../../../portal/src/components/UserList';

DomMock('<html><body></body></html>');

describe('[Portal] Testing UserList Component', () => {

    const props = {
        users: [
            {
                accountid: 'facebook-XXXXXX',
                username: 'Miss A',
                email: 'cheng@trend.com.tw',
                role: 'User'
            }, {
                accountid: 'facebook-YYYYYY',
                username: 'Mr. B',
                email: 'wang@trend.com.tw',
                role: 'Designer'
            }, {
                accountid: 'facebook-ZZZZZZZ',
                username: 'Mr. C',
                email: 'lin@trend.com.tw',
                role: 'Admin'
            }],
        usersActions: () => {},
        webpageActions: () => {}
    };
    const content = TestUtils.renderIntoDocument(
        <UserList {...props} />
    );

    it('user list: count user\'s number', () => {
        const list = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-name');
        expect(list.length).toEqual(3);
    });

    it('user list: check user data', () => {
        const name = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-name');
        expect(name[0].textContent).toEqual(props.users[0].username);
        expect(name[1].textContent).toEqual(props.users[1].username);
        expect(name[2].textContent).toEqual(props.users[2].username);

        // User role
        const user = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-user');
        expect(user[0].classList.length).toEqual(2);
        expect(user[1].classList.length).toEqual(1);
        expect(user[2].classList.length).toEqual(1);

        // Designer role
        const designer = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-designer');
        expect(designer[0].classList.length).toEqual(1);
        expect(designer[1].classList.length).toEqual(2);
        expect(designer[2].classList.length).toEqual(1);

        // Admin role
        const admin = TestUtils.scryRenderedDOMComponentsWithClass(content, 'ut-admin');
        expect(admin[0].classList.length).toEqual(1);
        expect(admin[1].classList.length).toEqual(1);
        expect(admin[2].classList.length).toEqual(2);
    });
});
