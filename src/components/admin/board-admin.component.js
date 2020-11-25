import React from "react";
import Image from '../landing/elements/Image';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from '../landing/sections/partials/SectionHeader';
import { Link } from "react-router-dom";

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}

const BoardAdmin = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'features-tiles section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-tiles-inner section-inner pt-0',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap center-content',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: 'Seja bem-vindo!',
    paragraph: 'Painel em construção...'
  };

  return (
    <section
      {...props}
      className={outerClasses}
      id={"featuresTiles"}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>
            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Link to= "/create-gym">
                        <Image
                          src={require('../../assets/images/feature-tile-icon-02.svg')}
                          alt="Features tile icon 05"
                          width={64}
                          height={64} />
                          </Link>
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h4 className="mt-0 mb-8">
                      Cadastrar Academia
                      </h4>
                      <div style={{ display: 'none'}}>
                    <p className="m-0 text-sm">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat..
                      </p>
                      </div>
                  </div>
                </div>
              </div>

              <div className="tiles-item reveal-from-bottom">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Link to= "/create-personal">
                        <Image
                          src={require('../../assets/images/feature-tile-icon-02.svg')}
                          alt="Features tile icon 01"
                          width={64}
                          height={64} />
                        </Link>
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h4 className="mt-0 mb-8">
                      Cadastrar Personal Trainer
                      </h4>
                      <div style={{ display: 'none'}}>
                    <p className="m-0 text-sm">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.
                      </p>
                      </div>
                  </div>
                </div>
              </div>

              <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
                <div className="tiles-item-inner">
                  <div className="features-tiles-item-header">
                    <div className="features-tiles-item-image mb-16">
                      <Link to= "/create-customer">
                        <Image
                          src={require('../../assets/images/feature-tile-icon-02.svg')}
                          alt="Features tile icon 02"
                          width={64}
                          height={64} />
                        </Link>
                    </div>
                  </div>
                  <div className="features-tiles-item-content">
                    <h4 className="mt-0 mb-8">
                      Cadastrar Aluno
                      </h4>
                      <div style={{ display: 'none'}}>
                    <p className="m-0 text-sm">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.
                      </p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

BoardAdmin.propTypes = propTypes;
BoardAdmin.defaultProps = defaultProps;

export default BoardAdmin;
