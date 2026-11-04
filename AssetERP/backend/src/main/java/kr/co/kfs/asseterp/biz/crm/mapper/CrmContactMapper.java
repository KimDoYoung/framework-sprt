package kr.co.kfs.asseterp.biz.crm.mapper;

import kr.co.kfs.asseterp.biz.crm.dto.CrmContactDetailRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactRes;
import kr.co.kfs.asseterp.biz.crm.dto.CrmContactSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CrmContactMapper {

    /** AS-IS crm09_contact.selectKeyInCompanyName — 이익제공(수령) 내역에 직접 입력한 거래상대방 이름(중복 제거). searchText는 `%…%`로 감싼 값 */
    List<CrmContactRes> selectKeyInCompanyName(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS crm09_contact.selectById (EE84 Crm09_Lookup_ContactPoint) — 회사 조건을 더했다 */
    CrmContactDetailRes selectById(@Param("companyId") Long companyId, @Param("contactId") Long contactId);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS crm.Crm09_Contact.modelUpdate의 INSERT (contactId 없음) — 연락일자는 오늘, 작성자는 로그인 사원 */
    int insert(@Param("contactId") long contactId, @Param("companyId") Long companyId, @Param("personId") Long personId, @Param("req") CrmContactSaveReq req);

    /** AS-IS crm.Crm09_Contact.modelUpdate의 UPDATE (contactId 있음) */
    int update(@Param("companyId") Long companyId, @Param("req") CrmContactSaveReq req);
}
