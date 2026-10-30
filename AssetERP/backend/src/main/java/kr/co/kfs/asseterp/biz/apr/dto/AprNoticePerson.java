package kr.co.kfs.asseterp.biz.apr.dto;

/** 알림을 받을 사원 (emp01_person.selectById 중 쓰는 열, AA01) */
public record AprNoticePerson(Long personId, String korName, String mobileTelNo, String emailAddress, Long companyId) {
}
