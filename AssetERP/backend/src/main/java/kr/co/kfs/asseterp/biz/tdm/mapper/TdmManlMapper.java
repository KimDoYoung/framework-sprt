package kr.co.kfs.asseterp.biz.tdm.mapper;

import kr.co.kfs.asseterp.biz.tdm.dto.ManlFormFileRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlItemRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlRelatesRes;
import kr.co.kfs.asseterp.biz.tdm.dto.ManlSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TdmManlMapper {

    /** AS-IS tdm43_manl.selectByManlOrgId — useYn은 '%'(전체)·'true'(사용)·'false'(미사용), searchText는 LIKE 패턴 */
    List<ManlItemRes> selectByManlOrgId(@Param("manlOrgId") Long manlOrgId, @Param("useYn") String useYn, @Param("searchText") String searchText);

    /** 점검항목이 속한 부서 책무매뉴얼 (없으면 null) — 삭제 대상이 요청한 부서 것인지 확인용 */
    Long selectManlOrgIdByManlId(@Param("manlId") Long manlId);

    /** AS-IS tdm45_manl_relate_ics.deleteByManlId */
    int deleteRelateIcsByManlId(@Param("manlId") Long manlId);

    /** AS-IS tdm46_manl_relate_icr.deleteByManlId */
    int deleteRelateIcrByManlId(@Param("manlId") Long manlId);

    /** AS-IS tdm47_manl_relate_dcr.deleteByManlId */
    int deleteRelateDcrByManlId(@Param("manlId") Long manlId);

    /** AS-IS sys11_relate_file.deleteByParentId */
    int deleteRelateFileByParentId(@Param("parentId") Long parentId);

    /** AS-IS UpdateDataModel.deleteModel(tdm43_manl) */
    int deleteById(@Param("manlId") Long manlId);

    /** AS-IS dbConfig.getSeq (f_create_seq) — 쓰기 트랜잭션에서 부른다 */
    Long selectNextId();

    /** AS-IS tdm43_manl.getNewManlCode — 회사의 올해 점검항목코드 다음 번호 (YY + 5자리) */
    String selectNewManlCode(@Param("companyId") Long companyId);

    /** 저장 대상 점검항목이 이미 있는지 (AS-IS IsNewData) */
    int countById(@Param("manlId") Long manlId);

    /** AS-IS UpdateDataModel 신규 입력(tdm43_manl) */
    int insertManl(@Param("req") ManlSaveReq req, @Param("companyId") Long companyId, @Param("manlCode") String manlCode,
                   @Param("firstRegEmpId") Long firstRegEmpId, @Param("updName") String updName);

    /** AS-IS UpdateDataModel 변경(tdm43_manl) — 화면이 고치는 열만 (점검항목코드가 비어 있으면 채움) */
    int updateManl(@Param("req") ManlSaveReq req, @Param("manlCode") String manlCode, @Param("updName") String updName);

    /** AS-IS tdm45_manl_relate_ics.selectByManlId */
    List<ManlRelatesRes.Ics> selectRelateIcs(@Param("manlId") Long manlId);

    /** AS-IS tdm46_manl_relate_icr.selectByManlId */
    List<ManlRelatesRes.Icr> selectRelateIcr(@Param("manlId") Long manlId);

    /** AS-IS sys11_relate_file.selectByParentId */
    List<ManlRelatesRes.Form> selectRelateForm(@Param("manlId") Long manlId);

    /** AS-IS tdm47_manl_relate_dcr.selectByManlId */
    List<ManlRelatesRes.Dcr> selectRelateDcr(@Param("manlId") Long manlId);

    /** AS-IS UpdateDataModel 신규 입력(tdm45) — 이미 연결돼 있으면 건너뜀 */
    int insertRelateIcs(@Param("manlId") Long manlId, @Param("classTreeId") Long classTreeId);

    /** AS-IS UpdateDataModel 신규 입력(tdm46) */
    int insertRelateIcr(@Param("manlId") Long manlId, @Param("classTreeId") Long classTreeId);

    /** AS-IS UpdateDataModel 신규 입력(sys11_relate_file, 부모 테이블 tdm43_manl) */
    int insertRelateForm(@Param("manlId") Long manlId, @Param("fileId") Long fileId);

    /** AS-IS UpdateDataModel 신규 입력(tdm47) */
    int insertRelateDcr(@Param("manlId") Long manlId, @Param("classTreeId") Long classTreeId);

    /** AS-IS tdm.Tdm45_ManlRelateIcs.delete (키로 삭제, 점검항목 일치 확인) */
    int deleteRelateIcsById(@Param("manlId") Long manlId, @Param("relateId") Long relateId);

    /** AS-IS tdm.Tdm46_ManlRelateIcr.delete */
    int deleteRelateIcrById(@Param("manlId") Long manlId, @Param("relateId") Long relateId);

    /** AS-IS sys.Sys11_RelateFile.delete */
    int deleteRelateFormById(@Param("manlId") Long manlId, @Param("relateId") Long relateId);

    /** AS-IS tdm.Tdm47_ManlRelateDcr.delete */
    int deleteRelateDcrById(@Param("manlId") Long manlId, @Param("relateId") Long relateId);

    /** AS-IS sys10_file.selectUnConnTdmFormFile — 아직 이 점검항목에 연결 안 된 책무점검 양식 파일 (parent = 회사) */
    List<ManlFormFileRes> selectUnConnFormFiles(@Param("companyId") Long companyId, @Param("formType") String formType,
                                                @Param("searchText") String searchText, @Param("relateId") Long relateId);
}
