package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.NoticeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/emp/mapper/emp90_notice.xml (selectByPersonId·selectByText·insert·delete) */
@Mapper
public interface EmpNoticeMapper {

    /** AS-IS emp90_notice.selectByPersonId — searchText는 "%글자%" */
    List<NoticeRes> selectByPersonId(@Param("personId") Long personId, @Param("searchText") String searchText);

    /** AS-IS emp90_notice.selectByText 의 건수 */
    int countByText(@Param("personId") Long personId, @Param("keyword") String keyword);

    int insert(@Param("personId") Long personId, @Param("keyword") String keyword);

    int delete(@Param("personId") Long personId, @Param("keyword") String keyword);
}
