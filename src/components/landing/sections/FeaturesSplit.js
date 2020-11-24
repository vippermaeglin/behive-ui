import React from 'react';
import classNames from 'classnames';
import { SectionSplitProps } from '../../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const FeaturesSplit = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

  const outerClasses = classNames(
    'features-split section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const sectionHeader = {
    title: 'Personal Training: Melhor ferramenta de fidelização do mercado',
    paragraph: 'É comprovado que um treinamento personalizado é a chave para a motivação e consequentemente a fidelização de alunos em uma academia.'
  };

  return (
    <section id={'sectionProduct'}
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={splitClasses}>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Academias
                  </div>
                <h3 className="mt-0 mb-12">
                  Retenção de CLIENTES e maior rentabilidade do espaço
                  </h3>
                <p className="m-0">
                  Este é o cenário ideal, não é mesmo empresário? Diante do incentivo da atuação de Personal Trainers em seu estabelecimento, sua empresa terá menor necessidade de contratação CLT, sua academia se tornará uma referência de mercado na prestação de serviços. O que acarretará na maior fidelização de alunos e otimização da ocupação do espaço de sua academia. Horários ociosos nunca mais...
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../../assets/images/features-split-image-01.png')}
                  alt="Features split 01"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-right" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Personal Trainers
                  </div>
                <h3 className="mt-0 mb-12">
                  Liberdade PROFISSIONAL e maior lucratividade
                  </h3>
                <p className="m-0">
                Com um canal exclusivo de captação de novos clientes para atender em várias academias, é possível ter controle de sua própria agenda e gerir carteira de clientes, pagar taxas justas relacionadas à produtividade e valor de mercado. Facilidade para cobrar pelos serviços prestados e compartilhamento de informações com seus clientes.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../../assets/images/features-split-image-02.png')}
                  alt="Features split 02"
                  width={528}
                  height={396} />
              </div>
            </div>

            <div className="split-item">
              <div className="split-item-content center-content-mobile reveal-from-left" data-reveal-container=".split-item">
                <div className="text-xxs text-color-primary fw-600 tt-u mb-8">
                  Alunos
                  </div>
                <h3 className="mt-0 mb-12">
                  Personal training de QUALIDADE ao seu alcance
                  </h3>
                <p className="m-0">
                  Nossa plataforma oferece acesso a uma rede de profissionais certificados e academias credenciadas, garantindo a excelência nas prestações de serviços. É comprovado que um treinamento sob medida é a base para a satisfação com os resultados eficientes e duradouros.
                  </p>
              </div>
              <div className={
                classNames(
                  'split-item-image center-content-mobile reveal-from-bottom',
                  imageFill && 'split-item-image-fill'
                )}
                data-reveal-container=".split-item">
                <Image
                  src={require('./../../../assets/images/features-split-image-03.png')}
                  alt="Features split 03"
                  width={528}
                  height={396} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

FeaturesSplit.propTypes = propTypes;
FeaturesSplit.defaultProps = defaultProps;

export default FeaturesSplit;