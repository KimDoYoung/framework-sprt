package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentCompanyRes;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentCompanySaveReq;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentRes;
import kr.co.kfs.asseterp.biz.fnd.dto.ConsignmentSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FndConsignmentMapper {

    /** AS-IS fnd03_consignment.selectByCompanyId0 (공통회사 0 전용) */
    List<ConsignmentRes> selectByCompanyId0(@Param("companyId") Long companyId, @Param("useYn") String useYn, @Param("searchText") String searchText);

    /** AS-IS fnd03_consignment.selectById */
    ConsignmentRes selectById(@Param("consignmentId") Long consignmentId);

    /** AS-IS fnd03_consignment.insertUpdate 중 UPDATE (기타 수탁사코드 01~10은 그대로 둔다) */
    int updateConsignment(@Param("req") ConsignmentSaveReq req);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS fnd03_consignment.insertUpdate 중 INSERT */
    int insertConsignment(@Param("consignmentId") Long consignmentId, @Param("req") ConsignmentSaveReq req, @Param("companyId") Long companyId);

    /** AS-IS selectByText (P05 조회창) */
    List<ConsignmentRes> selectByText(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS fnd03_consignment.selectByCompanyId (R10 Fnd03_Tab_Consignment — 회사별 수탁사 목록) */
    List<ConsignmentCompanyRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("useYn") String useYn, @Param("searchText") String searchText);

    /** AS-IS fnd03_consignment.selectById (R10 회사별 전체 열) */
    ConsignmentCompanyRes selectCompanyById(@Param("consignmentId") Long consignmentId);

    /** AS-IS fnd03_consignment.selectByCd (R10 preUpdate 중복 코드 검사) */
    int countByCd(@Param("companyId") Long companyId, @Param("consignmentCode") String consignmentCode);

    /** AS-IS UpdateDataModel(fnd03_consignment) INSERT (R10) */
    int insertCompanyConsignment(@Param("consignmentId") Long consignmentId, @Param("req") ConsignmentCompanySaveReq req, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel(fnd03_consignment) UPDATE (R10) */
    int updateCompanyConsignment(@Param("req") ConsignmentCompanySaveReq req, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel(fnd03_consignment) DELETE (R10) */
    int deleteCompanyConsignments(@Param("companyId") Long companyId, @Param("consignmentIds") List<Long> consignmentIds);
}
