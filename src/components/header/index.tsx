import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import logo from 'assets/logo.png';
import UserInfo from './user-info';
import styles from './style.module.scss';
import { Link } from 'react-router-dom';

const Header: React.FC<RouteComponentProps> = ({ history }) => {
  const menuItems: any[] = [
    { title: 'Home', link: '/' },
    { title: 'Event Production', link: '/' },
    { title: 'Event Search', link: 'https://results.tourneymaster.com' },
    { title: 'Support', link: '/support' },
    { title: 'About', link: 'https://www.tourneymaster.org/about/' },
    { title: 'Contact', link: 'https://www.tourneymaster.org/contact/' },
  ];

  // const onMenuClick = (item: string) => {
  //   return item;
  // };

  const onLogoClick = () => {
    history.push('/');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <img
          src={logo}
          onClick={onLogoClick}
          className={styles.logo}
          alt="logo"
        />
        <div className={styles.listWrapper}>
          <ul className={styles.list}>
            {menuItems.map((item: any, index: number) => (
              <li
                className={styles.listItem}
                // onClick={onMenuClick.bind(undefined, item.title)}
                key={index}
              >
                {!item.link.includes('http') ? (
                  <Link to={item.link}>{item.title}</Link>
                ) : (
                    <a
                      href={item.link}
                      target={'_blank'}
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                  )}
              </li>
            ))}
          </ul>
        </div>
        <UserInfo />
      </div>
    </div>
  );
};

export default withRouter(Header);
