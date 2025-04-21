import { BreadCrumb } from 'primereact/breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import { breadcrumbMap } from '../../utils/breadcrumbLabels';

export const DynamicBreadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter((x) => x);

  const items = pathnames.map((_, index) => {
    const fullPath = '/' + pathnames.slice(0, index + 1).join('/');
    return {
      label: breadcrumbMap[fullPath] || pathnames[index],
      command: () => navigate(fullPath),
    };
  });

  return (
    <BreadCrumb
    className='bg-gray-50 text-[12px] px-0'
      model={items}
      home={{ icon: 'pi pi-home', command: () => navigate('/') }}
    />
  );
};
