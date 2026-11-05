package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.MenuInfoNoticeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp91_menu_info_notice.xml */
@Mapper
public interface EmpMenuInfoNoticeMapper {

    /** AS-IS emp91_menu_info_notice.selectByText (searchText는 LIKE 패턴) */
    List<MenuInfoNoticeRes> selectByText(@Param("personId") Long personId, @Param("searchText") String searchText);

    /** AS-IS emp91_menu_info_notice.selectByMenuId 의 건수 (menuId 0 = 전체 차단) */
    int countByMenuId(@Param("personId") Long personId, @Param("menuId") Long menuId);

    /** AS-IS emp91_menu_info_notice.insert (id는 f_create_seq) */
    int insert(@Param("personId") Long personId, @Param("menuId") Long menuId);

    /** AS-IS Emp91_MenuInfoNotice.updatePersonId 의 갱신 가지: 차단일자를 오늘로 */
    int updateDate(@Param("personId") Long personId, @Param("menuId") Long menuId);

    /** AS-IS emp91_menu_info_notice.deletePersonId */
    int deleteByMenuId(@Param("personId") Long personId, @Param("menuId") Long menuId);

    /** AS-IS UpdateDataModel.deleteModel(emp91_menu_info_notice) — 본인 행만 */
    int deleteByIds(@Param("personId") Long personId, @Param("ids") List<Long> ids);


    /** AS-IS emp91_menu_info_notice.deleteMenuId — 그 회사 사원들의 이 메뉴 차단 기록 */
    int deleteByCompanyMenu(@Param("companyId") Long companyId, @Param("menuId") Long menuId);
}
