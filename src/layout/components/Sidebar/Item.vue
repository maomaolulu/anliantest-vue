<script>
export default {
    name: 'MenuItem',
    functional: true,
    props: {
        icon: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
    },
      render(h, context) {
        const { icon, title } = context.props
        const vnodes = []

        if (icon) {
        //   vnodes.push(<SvgIcon name={icon}/>)
        }

        if (title) {
          if (title.length > 5) {
            vnodes.push(<span slot='title' title={(title)}>{(title)}</span>)
          } else {
            vnodes.push(<span slot='title'>{(title)}</span>)
          }
        }
        return vnodes
      }
    // render: function (createElement, context) {
    //     const vnodes = [];

    //     const { icon, title } = context.props;

    //     if (icon) {
    //         const elHtml = createElement('i', {
    //             attrs: {
    //                 class: icon,
    //             },
    //         });

    //         console.log(elHtml);

    //         vnodes.push(elHtml);
    //     }

    //     if (title) {
    //         const elHtml = createElement(
    //             'span',
    //             {
    //                 attrs: {
    //                     slot: title,
    //                 },
    //             },
    //             title,
    //         );

    //         console.log(elHtml);

    //         vnodes.push(elHtml);
    //     }

    //     return vnodes;
    // },
};
</script>
