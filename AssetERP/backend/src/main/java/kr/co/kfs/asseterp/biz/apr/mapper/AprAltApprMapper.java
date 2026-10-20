package kr.co.kfs.asseterp.biz.apr.mapper;

import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprRes;
import kr.co.kfs.asseterp.biz.apr.dto.AprAltApprSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AprAltApprMapper {

    /** AS-IS apr07_alt_appr.selectByEmpId — 원결재자(로그인 사원)의 대결자 목록 */
    List<AprAltApprRes> selectByEmpId(@Param("empId") Long empId);

    /** AS-IS apr07_alt_appr.notAltApprIdList — 화면 목록(altApprIds)에 없는 같은 회사·사원의 대결자 (중복 기간 검사용). altApprIds는 비어 있으면 조건 없음 */
    List<AprAltApprRes> selectNotInIds(@Param("companyId") Long companyId, @Param("empId") Long empId, @Param("altApprIds") List<Long> altApprIds);

    /** AS-IS apr07_alt_appr.selectById — 저장 결과 한 행 */
    AprAltApprRes selectById(@Param("altApprId") Long altApprId, @Param("empId") Long empId);

    /** AS-IS dbConfig.getSeq와 같은 식 */
    long selectNextId();

    /** AS-IS Apr07_AltAppr.update → UpdateDataModel(apr07_alt_appr) INSERT */
    int insert(@Param("empId") Long empId, @Param("req") AprAltApprSaveReq req);

    /** AS-IS Apr07_AltAppr.update → UpdateDataModel UPDATE — 로그인 사원의 행만 */
    int update(@Param("empId") Long empId, @Param("req") AprAltApprSaveReq req);

    /** AS-IS Apr07_AltAppr.delete → UpdateDataModel.deleteModel — 로그인 사원의 행만 */
    int deleteById(@Param("empId") Long empId, @Param("altApprId") Long altApprId);
}
