package kr.co.kfs.asseterp.biz.crm.mapper;

import kr.co.kfs.asseterp.biz.crm.dto.CrmContactRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CrmContactMapper {

    /** AS-IS crm09_contact.selectKeyInCompanyName — 이익제공(수령) 내역에 직접 입력한 거래상대방 이름(중복 제거). searchText는 `%…%`로 감싼 값 */
    List<CrmContactRes> selectKeyInCompanyName(@Param("companyId") Long companyId, @Param("searchText") String searchText);
}
